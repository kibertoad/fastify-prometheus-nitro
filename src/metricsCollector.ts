import {FastifyReply, FastifyRequest} from "fastify";

export function getRouteSlug(args: { method: string; url: string }): string {
    return `[${args.method}] ${args.url}`;
}

export function requestMetricsCollector(request: FastifyRequest, _response: FastifyReply, done: any) {
    const { routeHist, routeSum } = request.promNitro.routeMetrics;
    const { options, metricStorage, routesWhitelist, methodBlacklist } = request.promNitro

    if (
        request.context.config.disableMetrics === true ||
        !request.raw.url
    ) {
        done();
        return;
    }

    if (options.routeMetrics.registeredRoutesOnly === false) {
        if (
            !methodBlacklist.has(request.routerMethod ?? request.method)
        ) {
            metricStorage.set(request, {
                hist: routeHist.startTimer(),
                sum: routeSum.startTimer(),
            });
        }

        return done();
    }

    if (
        routesWhitelist.has(
            getRouteSlug({
                method: request.routerMethod,
                url: request.routerPath,
            })
        )
    ) {
        metricStorage.set(request, {
            hist: routeHist.startTimer(),
            sum: routeSum.startTimer(),
        });
    }

    done();
}

export function responseMetricsCollector(request: FastifyRequest, reply: FastifyReply, done: any) {
    const { metricStorage, routeMetrics, options } = request.promNitro;

    const metrics = metricStorage.get(request);
    if (!metrics) {
        return done();
    }

    const statusCode =
        options.routeMetrics.groupStatusCodes === true
            ? `${Math.floor(reply.statusCode / 100)}xx`
            : reply.statusCode;
    const route =
        request.context.config.statsId ??
        request.routerPath ??
        options.routeMetrics.invalidRouteGroup ??
        '__unknown__';
    const method = request.routerMethod ?? request.method;

    const labels = {
        [routeMetrics.labelNames.method]: method,
        [routeMetrics.labelNames.route]: route,
        [routeMetrics.labelNames.status]: statusCode,
    };
    metrics.sum(labels);
    metrics.hist(labels);

    done();
}

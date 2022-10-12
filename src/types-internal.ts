import promClient, {Histogram, LabelValues, Summary} from "prom-client";
import {FastifyInstance} from "fastify";
import {IMetricsPluginOptions} from "./types";

/**
 * Plugin constructor
 *
 * @public
 */
export interface IConstructiorDeps {
    /** Prometheus client */
    client: typeof promClient;
    /** Fastify instance */
    fastify: FastifyInstance;
    /** Metric plugin options */
    options: IMetricsPluginOptions;
}

export interface IReqMetrics<T extends string> {
    hist: (labels?: LabelValues<T>) => number;
    sum: (labels?: LabelValues<T>) => void;
}

export interface IRouteMetrics {
    routeHist: Histogram<string>;
    routeSum: Summary<string>;
    labelNames: { method: string; status: string; route: string };
}

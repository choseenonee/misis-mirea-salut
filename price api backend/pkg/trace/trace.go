package trace

import (
	"fmt"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/jaeger"
	"go.opentelemetry.io/otel/sdk/resource"
	tracesdk "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
	"go.opentelemetry.io/otel/trace"
)

func NewJaegerExporter(url string) (tracesdk.SpanExporter, error) {
	return jaeger.New(jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(url)))
}

func NewTraceProvider(exp tracesdk.SpanExporter, ServiceName string) (*tracesdk.TracerProvider, error) {
	// Ensure default SDK resources and the required service name are set.
	r, err := resource.Merge(
		resource.Default(),
		resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceNameKey.String(ServiceName),
		),
	)
	if err != nil {
		return nil, err
	}

	return tracesdk.NewTracerProvider(
		tracesdk.WithBatcher(exp),
		tracesdk.WithResource(r),
		//tracesdk.WithSampler(tracesdk.Sample)
	), nil
}

func InitTracer(jaegerURL string, serviceName string) trace.Tracer {
	exporter, err := NewJaegerExporter(jaegerURL)
	if err != nil {
		panic(fmt.Sprintf("initialize exporter: %v", err))
	}

	tp, err := NewTraceProvider(exporter, serviceName)
	if err != nil {
		panic(fmt.Sprintf("initialize provider: %v", err))
	}

	otel.SetTracerProvider(tp)

	return tp.Tracer("main tracer")
}

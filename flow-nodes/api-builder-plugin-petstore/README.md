# api-builder-plugin-petstore
An API Builder flow-node plugin that exports Petstore API functions.

Internally, the plugin uses the same engine as `@axway/api-builder-plugin-fn-swagger` to package and version OAS 2/3 specs from the plugin's `openapi` directory in a managed way.

## About flow-nodes

Flow-nodes are used within [Axway API Builder's](https://www.axway.com/en/datasheet/axway-api-builder)
flow editor that is a low-code / no-code solution to designing and developing services
that integrate to many different connected components, such as databases and APIs.

## Getting started

1. Follow the [Getting Started Guide](https://docs.axway.com/bundle/API_Builder_4x_allOS_en/page/api_builder_getting_started_guide.html) to create an API Builder service
1. Use this package as a template to start your own OpenAPI flow-node. Just drag and drop OAS specs and icons into the `openapi` directory, modify the version and name to a plugin name of your choice, and change the tests to apply to your own OAS specs.
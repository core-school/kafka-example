import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { Kafka } from "kafkajs";
import fp from "fastify-plugin";

const kafka_client = new Kafka({
  clientId: "core-api",
  brokers: ["127.0.0.1:9092"],
});

const create_producer = async (app: FastifyInstance) => {
  const producer = kafka_client.producer();
  await producer.connect();
  app.log.info("✅ Kafka producer ready");
  return producer;
};

export const kafka_plugin = fp(async (app) => {
  // Create and decorate instance with producer
  let producer;
  app.decorate("get_producer", () => producer);
  app.addHook("onReady", async () => {
    producer = await create_producer(app);
  });
});

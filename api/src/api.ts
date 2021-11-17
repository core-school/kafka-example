import fastify from "fastify";
import { Producer } from "kafkajs";
import { kafka_plugin } from "./kafka_plugin";

(async () => {
  const srv = fastify({
    logger: {
      prettyPrint: true,
    },
  });

  await srv.register(kafka_plugin);

  srv.get<{ Querystring: { data: string } }>("/msg", async (req, res) => {
    // CORE: Message must be a string
    const message = `CORE says: ${req.query.data || "nothing"}`;

    // CORE: Send message to kafka in specific topic
    const producer: Producer = (srv as any).get_producer();
    const record_metadata = await producer.send({
      topic: "core-school-example",
      messages: [{ value: message }],
    });
    req.log.info("✅🥳 Kafka message sent!");
    return {
      status: "OK",
      record_metadata,
    };
  });

  const PORT = 3500;

  srv.listen(PORT);
})();

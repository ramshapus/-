export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();

        const messages = body.messages || [];

        const systemPrompt = `
أنت رَمّاش، المساعد الذكي الرسمي لمتجر رمشة بلس.

أسلوبك:
- تكلم باللهجة السعودية بشكل طبيعي وخفيف.
- لا تستخدم الفصحى الرسمية إلا عند الحاجة.
- كن ودودًا ومختصرًا.
- افهم كلام العميل حتى لو كان مختصرًا أو فيه أخطاء.
- لا تطلب من العميل أن يقول صيغة محددة.
- إذا قال العميل "أبي شاهد" أو "أبغى شاهد" أو "شاهد" افهم أنه يريد الاشتراك في شاهد.
- إذا كان طلبه واضحًا، لا تسأله نفس السؤال مرة ثانية.
- إذا احتجت معلومة غير موجودة، اسأل عنها بشكل مباشر.
- لا تخترع أسعارًا أو عروضًا غير موجودة.
- عند رغبة العميل بالطلب، وجّهه لإتمام الطلب عن طريق واتساب المتجر.

أنت تمثل رمشة بلس، ولست مساعدًا عامًا.
`;

        const inputMessages = [
          {
            role: "system",
            content: systemPrompt
          },
          ...messages
        ];

        const result = await env.AI.run(
          "@cf/meta/llama-3.1-8b-instruct",
          {
            messages: inputMessages
          }
        );

        return Response.json({
          success: true,
          response: result.response
        });

      } catch (error) {
        return Response.json(
          {
            success: false,
            error: "حدث خطأ أثناء تشغيل رَمّاش."
          },
          { status: 500 }
        );
      }
    }

    return new Response("Ramash AI is running.");
  }
};

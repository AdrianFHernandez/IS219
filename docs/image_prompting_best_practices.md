# Best Practices for Prompting OpenAI Image Models

This document summarizes practical guidance for writing prompts for OpenAI image generation models to get high-quality, controllable results.

1. Be specific and concise
   - Describe the subject, environment, lighting, style, and color palette.
   - Example: "A vintage red bicycle leaning against a brick wall at golden hour, shallow depth of field, photorealistic, 50mm lens".

2. Use style anchors and references
   - Mention photographic styles (photorealistic, macro, long exposure), art styles (impressionist, watercolor), or reference artists when appropriate.

3. Specify composition and camera details for photorealism
   - Use terms like "close-up", "wide-angle", "35mm", "shallow depth of field", "bokeh", "soft lighting".

4. Control format and aspect ratio
   - Add size or aspect ratio hints such as "square", "16:9", or "1024x1024" when supported by the API.

5. Iterate with anchors
   - Start with a strong core prompt, then iterate: add or remove adjectives, change lighting, or swap style anchors.

6. Use negative prompts / constraints when supported
   - If the model supports negative prompting, include things to avoid (e.g., "no text", "no watermark"). If not supported, explicitly state "no text" in the prompt.

7. Prefer single-responsibility prompts
   - Keep prompts focused on a single desired outcome rather than combining many unrelated requests.

8. Experiment with temperature / sampling if available
   - Lower randomness for consistent, predictable outputs; increase for more creative variety when supported.

9. Post-process and filter
   - Use simple heuristics (face detectors, text detectors) to filter unwanted outputs (e.g., logos or personal data) before use.

10. Respect copyright and safety
   - Avoid prompting to reproduce copyrighted material or create images that violate safety policies.

References and examples
- Prompts that work well:
  - "Hyperrealistic portrait of an elderly woman with silver hair, soft rim lighting, 85mm lens, 4k, film grain"
  - "Isometric illustration of a futuristic city, neon color palette, vector style, flat shadows"

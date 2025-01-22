import axios from "axios"
import delay from "delay"
import { ApiStreamUsageChunk } from "./stream"

export async function fetchOpenRouterGenerationDetails(genId: string, apiKey: string): Promise<ApiStreamUsageChunk> {
	await delay(500) // FIXME: necessary delay to ensure generation endpoint is ready

	try {
		const response = await axios.get(`https://openrouter.ai/api/v1/generation?id=${genId}`, {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
			timeout: 5_000, // this request hangs sometimes
		})

		const generation = response.data?.data
		console.log("OpenRouter generation details:", response.data)
		return {
			type: "usage",
			// cacheWriteTokens: 0,
			// cacheReadTokens: 0,
			// openrouter generation endpoint fails often
			inputTokens: generation?.native_tokens_prompt || 0,
			outputTokens: generation?.native_tokens_completion || 0,
			totalCost: generation?.total_cost || 0,
		}
	} catch (error) {
		// ignore if fails
		console.error("Error fetching OpenRouter generation details:", error)
		return {
			type: "usage",
			inputTokens: 0,
			outputTokens: 0,
			totalCost: 0,
		}
	}
}

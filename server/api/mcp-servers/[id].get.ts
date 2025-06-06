import { McpService } from '~/server/utils/mcp'

export default defineEventHandler(async (event) => {
    const mcpService = new McpService()

    try {
        const id = parseInt(getRouterParam(event, 'id') || '0')

        if (!id || isNaN(id)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invalid server ID'
            })
        }

        const server = await mcpService.getServerById(id)

        if (!server) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Server not found'
            })
        }

        return {
            success: true,
            data: server
        }
    } catch (error: any) {
        console.error('Failed to fetch MCP server:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch MCP server'
        })
    } finally {
        await mcpService.close()
    }
})

sed 's/const session = session_getter(req, res);/const session = await session_getter(req, res);/' ./node_modules/sapper/runtime/src/server/middleware/get_page_handler.ts

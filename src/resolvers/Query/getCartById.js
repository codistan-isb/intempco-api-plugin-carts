import { decodeCartOpaqueId } from "../../xforms/id.js";

export default async function getCartById(parentResult, args, context) {
  const { input: { id } } = args;

  return context.queries.getCartById(context, {
    cartId: decodeCartOpaqueId(id)
  });
}

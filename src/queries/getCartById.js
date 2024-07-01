import ReactionError from "@reactioncommerce/reaction-error";

export default async function getCartById(context, { cartId } = {}) {
  try {
    const { collections, userId } = context;
    const { Cart, Products } = collections;
  
    console.log("cartId", cartId, "userId", userId)
    
    if (!userId) {
      throw new ReactionError("access-denied", "Please login first");
    }

    if (!cartId) {
      throw new ReactionError("invalid-param", "You must provide a cartId");
    }
  
    const cartData = await Cart.findOne({
      _id: cartId,
      accountId: userId
    })
  
    const productData = await Products.findOne({
      _id: cartData?.items?.[0]?.productConfiguration?.productId
    });

    return {
      ...cartData,
      productData
    }
  } catch(err) {
    console.log("Some Error Occured", err);
    throw new ReactionError(err, "Some Error Occured")
  }
}

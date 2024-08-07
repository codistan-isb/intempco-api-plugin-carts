import ReactionError from "@reactioncommerce/reaction-error";
import { decodeProductOpaqueId, decodeShopOpaqueId, encodeCartItemOpaqueId, encodeCartOpaqueId } from "../xforms/id.js";


export default async function getCartById(context, { cartId } = {}) {
  try {
    const { collections, userId } = context;
    const { Cart, Products, RFQProduct } = collections;
  
    console.log("cartId", cartId, "userId", userId)
    
    if (!userId) {
      throw new ReactionError("access-denied", "Please login first");
    }

    if (!cartId) {
      throw new ReactionError("invalid-param", "You must provide a cartId");
    }


  //  const encodedID= encodeCartOpaqueId("yd7SJf6enswwHwBwb")
  //  console.log("DATA", encodedID)

  

    const cartData = await Cart.findOne({
      _id: cartId,
      accountId: userId
    }) 

    const productConfiguration = cartData?.items?.[0]?.productConfiguration;


    if (!productConfiguration) {
      throw new ReactionError("not-found", "Product configuration not found in cart");
    }
  
    const productId = productConfiguration.productId;
    const productVariantId = productConfiguration.productVariantId;    



    const productData = await Products.findOne({
      _id: productId,
      type:"simple"
    });


    const rfqData = await RFQProduct.findOne({
      _id: cartData?.rfqId
    });
   
      const variantData = await Products.findOne({
        _id: productVariantId,
        type:"variant"
      });


    
    return {
      ...cartData,
      productData,
      variantData,
      rfqData
    }
  } catch(err) {
    console.log("Some Error Occured", err);
    throw new ReactionError(err, "Some Error Occured")
  }
}

import ordersAdapter from '~/services/orders-adapter'
import orderProductsAdapter from '~/services/order-products-adapter'

export default function useOrders() {
  async function getOrdersWithProduct({ userId, orderPage, sort }) {
    const { orders, lastPage, currentPage } = await ordersAdapter().getOrders({
      include: 'user,metalInsertGroup,cart.cartItems.product.productFiles.file',
      filter: { userId },
      sort,
      page: orderPage,
    })

    const ordersIds = orders.map((order) => order.id).toString()

    const { data } = await orderProductsAdapter().getProducts({
      include: 'file.file,product',
      filter: { orderId: ordersIds },
    })

    return {
      orders: {
        orders,
        lastPage,
        currentPage,
      },
      products: data,
    }
  }

  return {
    getOrdersWithProduct,
  }
}

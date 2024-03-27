import { orderSchema } from "../schemas/orderSchema"
import orderService from "../services/order-service"
import { Request, Response, NextFunction } from "express"
import helpers, { ResponseData } from "../helpers/Helpers"


const orderController = {
  orderEncryption: (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    orderService.orderEncryption(data, (error, data) => error ? next(error) : res.status(200).json(ResponseData('200', 'OK', data))
    )
  },
  checkOrder: (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    console.log(id)
    orderService.checkOrder(id, (error, data) => error ? next(error) : res.status(200).json(ResponseData('200', 'OK', data))
    )
  },
  PaymentCallback: (req: Request, res: Response, next: NextFunction) => {
    const response = req.body
    orderService.PaymentCallback(response, (error) => error ? next(error) : res.end())
  },
  postOrder: (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = orderSchema.validate(req.body)
    if (error) {
      return res.status(400).json(ResponseData('400', error.details[0].message, null))
    }
    const { order, shipping, payment, orderItems, shippingFeeId } = value
    const user = helpers.getUser(req)
    if (!user) return res.status(401).json(ResponseData('401', 'unauthorized', null))
    orderService.postOrder(user, order, shipping, payment, orderItems, shippingFeeId, (error, data) => error ? next(error) : res.status(200).json(ResponseData('200', 'OK', data)))
  },
  getOrders: (req: Request, res: Response, next: NextFunction) => {
    orderService.getOrders((error, data) => error ? next(error) : res.status(200).json(ResponseData('200', 'Ok', data)))
  }
}

export default orderController
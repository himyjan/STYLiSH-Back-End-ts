import { Model, Optional, Sequelize, DataTypes } from "sequelize"
import db from './index'

interface OrderAttributes {
  id: number
  userId: number
  shippingFeeId: number
  totalPrice: number
  status: string
  provider: string
  aesEncrypt?: string
  shaEncrypt?: string
  email: string
  createdAt: Date
  updatedAt: Date
}

interface OrderInput extends Optional<OrderAttributes, 'id' | 'createdAt' | 'updatedAt'> { }
export interface OrderOutput extends Required<OrderAttributes> { }

class Order extends Model<OrderAttributes, OrderInput> implements OrderAttributes {
  static associate(model: typeof db) {
    Order.belongsTo(model.User, { foreignKey: 'userId' })
    Order.belongsTo(model.ShippingFee, { foreignKey: 'shippingFeeId' })
    Order.hasOne(model.Shipping, { foreignKey: 'orderId' })
    Order.hasOne(model.Payment, { foreignKey: 'orderId' })
    Order.hasMany(model.OrderItem, { foreignKey: 'orderId' })
  }
  id!: number
  userId!: number
  shippingFeeId!: number
  totalPrice!: number
  status!: string
  provider!: string
  aesEncrypt?: string
  shaEncrypt?: string
  email!: string
  createdAt!: Date
  updatedAt!: Date
}

const orderInit = (sequelize: Sequelize) => {
  Order.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    shippingFeeId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    totalPrice: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: ['Pending', 'Processing', 'Delivered', 'Cancelled']
    },
    provider: {
      allowNull: false,
      type: DataTypes.STRING
    },
    aesEncrypt: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    shaEncrypt: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}

export default orderInit
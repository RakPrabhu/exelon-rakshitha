/**
 * @swagger
 * components:
 *   schemas:
 *     PlatformSettings:
 *       type: object
 *       example:
 *         _id: "60af924ffbabcdef56789012"
 *         kiteExchPreference: "NSE"
 *         kiteOrderType: "LIMIT"
 *         kiteVariety: "regular"
 *         kiteProduct: "MIS"
 *         kiteReadOnly: false
 *         isDeleted: false
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           description: _id of the Settings
 *         kiteExchPreference:
 *           type: string
 *           description: kiteExchPreference of the Settings
 *         kiteOrderType:
 *           type: string
 *           enum:
 *             - LIMIT
 *             - MARKET
 *           description: kiteOrderType of the Settings
 *         kiteVariety:
 *           type: string
 *           enum:
 *             - regular
 *             - amo
 *             - co
 *           description: kiteVariety of the Settings
 *         kiteProduct:
 *           type: string
 *           enum:
 *             - MIS
 *             - CNC
 *             - NRML
 *           description: kiteProduct of the Settings
 *         kiteReadOnly:
 *           type: boolean
 *           description: kiteReadOnly of the Settings
 *         isDeleted:
 *           type: boolean
 *           description: whether the Settings is deleted
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the settings were created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the settings were last updated
 * 
 *     KiteOrderType:
 *       type: string
 *       enum:
 *         - LIMIT
 *         - MARKET
 *       description: Order type in Kite platform
 * 
 *     KiteVariety:
 *       type: string
 *       enum:
 *         - regular
 *         - amo
 *         - co
 *       description: Order variety in Kite platform
 * 
 *     KiteProduct:
 *       type: string
 *       enum:
 *         - MIS
 *         - CNC
 *         - NRML
 *       description: Product types available in Kite platform
 */
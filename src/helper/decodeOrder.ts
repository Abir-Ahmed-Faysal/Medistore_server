const orders = [
  {
    "id": "0115b7b7-d3c5-4b2b-ab2d-b1a99ad33966",
    "createdAt": "2026-01-31T05:05:33.587Z",
    "totalAmount": "20",
    "status": "PLACED",
    "orderItems": [
      {
        "id": "c2ec3fde-2dd8-44bb-bde7-b9c8f2a9a768",
        "createdAt": "2026-01-31T05:03:15.170Z",
        "totalAmount": "10",
        "status": "PLACED",
        "orderItems": [
          {
            "quantity": 2,
            "medicineRef": {
              "price": "5",
              "title": "Napa Extra 500mg",
              "description": "napa is a pain reliever, fever reducer, and anti-inflammatory medication used to treat mild to moderate pain and reduce fever.",
              "manufacturer": "Square Pharmaceuticals Ltd.",
              "categoryRef": {
                "category_name": "paracetamol"
              },
              "reviews": []
            }
          }
        ]
      }
    ]

  }
]




export const decodeOrders = (orders: any[]) => {
  return orders.map(order => ({
    ...order,
    orderItems: order.orderItems.map((orderItem: any) => ({
      ...orderItem,
      orderItems: orderItem.orderItems.map((item: any) => {
        const { medicineRef } = item
        const { categoryRef, ...medicine } = medicineRef || {}

        return {
          quantity: item.quantity,
          ...medicine,
          ...categoryRef
        }
      })
    }))
  }))
}


const data= decodeOrders(orders)

console.log(JSON.stringify(data));


[{"id":"0115b7b7-d3c5-4b2b-ab2d-b1a99ad33966","createdAt":"2026-01-31T05:05:33.587Z","totalAmount":"20","status":"PLACED","orderItems":[{"id":"c2ec3fde-2dd8-44bb-bde7-b9c8f2a9a768","createdAt":"2026-01-31T05:03:15.170Z","totalAmount":"10","status":"PLACED","orderItems":[{"quantity":2,"price":"5","title":"Napa Extra 500mg","description":"napa is a pain reliever, fever reducer, and anti-inflammatory medication used to 
treat mild to moderate pain and reduce fever.","manufacturer":"Square Pharmaceuticals Ltd.","reviews":[],"category_name":"paracetamol"}]}]}]

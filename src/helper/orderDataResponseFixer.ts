// order.mapper.ts
export const mapOrderResponse = (order: any) => {
  const items = order.orderItems.map((item: any) => {
    const price = Number(item.medicineRef.price);
    const quantity = item.quantity;

    return {
      title: item.medicineRef.title,
      description: item.medicineRef.description,
      manufacturer: item.medicineRef.manufacturer,
      price,
      quantity,
      totalPrice: price * quantity,
    };
  });

  const totalPrice = items.reduce(
    (sum: number, item: any) => sum + item.totalPrice,
    0
  );

  return {
    id: order.id,
    address: order.address,
    status: order.status,
    createdAt: order.createdAt,
    items,
    totalPrice,
  };
};

export default async function GetProductbyID(id) {
  const result = await fetch(`https://fakestoreapi.com/products/${id}`);
  return result.json();
}

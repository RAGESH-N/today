import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-cart',
  templateUrl: './view-cart.component.html',
  styleUrls: ['./view-cart.component.css']
})
export class ViewCartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCart();
  }

  fetchCart() {
  const userId = localStorage.getItem('userId');
  this.http.get<any[]>(`http://localhost:3000/api/cart/user/${userId}`).subscribe({
    next: (data) => {
      this.cartItems = data;
      // Check for _id
      console.log('Cart items:', this.cartItems);
      this.calculateTotal();
    },
    error: (err) => console.error('Error fetching cart:', err)
  });
}

  calculateTotal() {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + (item.price * (item.quantity || 1)),
      0
    );
  }

  updateQuantity(cartItem: any, newQuantity: number) {
    if (newQuantity < 1) return;
    cartItem.quantity = newQuantity;
    this.calculateTotal();
    this.http.patch(`http://localhost:3000/api/cart/${cartItem._id}`, { quantity: newQuantity }).subscribe({
      next: () => {},
      error: (err) => {
        alert('Error updating quantity');
        console.error(err);
      }
    });
  }

  removeItem(item: any) {
  console.log('Attempting to remove:', item);
  if (!item._id) {
    alert('Invalid cart item ID');
    return;
  }
  this.http.delete(`http://localhost:3000/api/cart/${item._id}`).subscribe({
    next: () => {
      this.cartItems = this.cartItems.filter(i => i._id !== item._id);
      this.calculateTotal();
    },
    error: (err) => {
      alert('Error removing cart item');
      console.error(err);
    }
  });
}
  clearCart() {
    const userId = localStorage.getItem('userId');
    this.http.delete(`http://localhost:3000/api/cart/user/${userId}`).subscribe({
      next: () => {
        this.cartItems = [];
        this.calculateTotal();
      }
    });
  }

  proceedToPayment() {
    alert('Proceeding to payment! (Implement your payment logic here)');
  }
}
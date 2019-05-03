import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';

export interface Customer {
  id?: string,
  name: string,
  email: string,
  mobile: string,
  device_id: string

}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private customers: Observable<Customer[]>;
  private customerCollection: AngularFirestoreCollection<Customer>;

  constructor(private afs: AngularFirestore) {
    this.customerCollection = this.afs.collection<Customer>('customers');
    this.customers = this.customerCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCustomers(): Observable<Customer[]> {
    return this.customers;
  }
 
  getCustomer(id: string): Observable<Customer> {
    return this.customerCollection.doc<Customer>(id).valueChanges().pipe(
      take(1),
      map(customer => {
        customer.id = id;
        return customer;
      })
    );
  }
 
  addCustomer(customer: Customer): Promise<DocumentReference> {
    return this.customerCollection.add(customer);
  }
 
  updateCustomer(customer: Customer): Promise<void> {
    return this.customerCollection.doc(customer.id).update(
    { 
      name: customer.name, 
      email: customer.name, 
      mobile: customer.mobile, 
      device_id: customer.device_id 
    });
  }
 
  deleteCustomer(id: string): Promise<void> {
    return this.customerCollection.doc(id).delete();
  }  
  
}

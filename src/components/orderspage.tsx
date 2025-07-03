// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Order {
  id: string;
  name: string;
  phone: string;
  status: string;
  totalPrice: number;
  wilaya: string;
  zrpost: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Fetch orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersCollection = collection(db, "orders");
        const q = query(ordersCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({
            id: doc.id,
            ...doc.data(),
          } as Order);
        });

        setOrders(ordersData);
        setFilteredOrders(ordersData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = orders;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (order) =>
          order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, orders]);

  // Update order status
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Update in Firebase
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
      });

      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Format date from Firebase timestamp
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    return format(new Date(timestamp.seconds * 1000), "dd/MM/yyyy HH:mm");
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">إدارة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="ابحث بالاسم أو رقم الهاتف أو رقم الطلب"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="في الانتظار">في الانتظار</SelectItem>
                <SelectItem value="تم التأكيد">تم التأكيد</SelectItem>
                <SelectItem value="في التوصيل">في التوصيل</SelectItem>
                <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>الزبون</TableHead>
                  <TableHead>الهاتف</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>المجموع</TableHead>
                  <TableHead>الولاية</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.phone}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {order.items.map((item, index) => (
                            <div key={index}>
                              {item.name} (x{item.quantity}) - {item.price} دج
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{order.totalPrice} دج</TableCell>
                      <TableCell>{order.wilaya}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "في الانتظار"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "تم التأكيد"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "في التوصيل"
                              ? "bg-purple-100 text-purple-800"
                              : order.status === "تم التسليم"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            updateOrderStatus(order.id, value)
                          }
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="تغيير الحالة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="في الانتظار">
                              في الانتظار
                            </SelectItem>
                            <SelectItem value="تم التأكيد">
                              تم التأكيد
                            </SelectItem>
                            <SelectItem value="في التوصيل">
                              في التوصيل
                            </SelectItem>
                            <SelectItem value="تم التسليم">
                              تم التسليم
                            </SelectItem>
                            <SelectItem value="ملغي">ملغي</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      لا توجد طلبات متطابقة مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                عرض {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} من {filteredOrders.length} طلب
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={firstPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">الصفحة الأولى</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">الصفحة السابقة</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-sm font-medium">
                  الصفحة {currentPage} من {totalPages}
                </div>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">الصفحة التالية</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={lastPage}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">الصفحة الأخيرة</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to update document in Firestore
async function updateDoc(docRef: any, data: any) {
  const { doc, updateDoc } = await import("firebase/firestore");
  return updateDoc(docRef, data);
}
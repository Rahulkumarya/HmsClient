// "use client"
// import React, { useEffect, useState } from "react";
// import { useSocket } from "../context/SocketContext";
// import { Bell } from "lucide-react";
// interface Notification {
//   type: string;
//   title: string;
//   message: string;
//   icon?: string;
//   data?: any;
// }

// export const NotificationIcon: React.FC = () => {
//   const  socket = useSocket();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (!socket) return;

//     console.log("Socket connected:", socket.id);

//     // Listen for server notifications
//     socket.on("notification", (payload: Notification, ackFn?: () => void) => {
//       // Add to local list
//       setNotifications((prev) => [payload, ...prev]);
//       // Send acknowledgement to server if provided
//       if (typeof ackFn === "function") ackFn();
//     });

//     return () => {
//       socket.off("notification");
//     };
//   }, [socket]);

//   // Mark all as read when dropdown opens
//   const handleToggle = () => {
//     setOpen(!open);
//     if (!open) {
//       // could call API to mark read here
//       setNotifications([]);
//     }
//   };

//   return (
//     <div className="relative">
//       <button onClick={handleToggle} className="p-2">
//         <Bell />
//         {notifications.length > 0 && (
//           <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
//             {notifications.length}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2">
//           {notifications.length === 0 ? (
//             <p className="text-center text-gray-500">No new notifications</p>
//           ) : (
//             notifications.map((n, i) => (
//               <div
//                 key={i}
//                 className="border-b last:border-none p-2 hover:bg-gray-100 cursor-pointer"
//               >
//                 <p className="font-semibold">{n.title}</p>
//                 <p className="text-sm">{n.message}</p>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };












"use client";

import React, { useEffect, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useSelector } from "react-redux";
import {store} from "../../redux/store"
import { Bell } from "lucide-react";
import { useMarkAllAsReadMutation } from "@/redux/features/patients/notificationApi";
import { ref } from "yup";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export const NotificationIcon: React.FC = () => {
  const {socket} = useSocket();
    const user = useSelector((state: store) => state.auth.user);
    const userId= user?._id;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [markAllAsRead] = useMarkAllAsReadMutation();

  useEffect(() => {
    if (!userId || !socket) return;

    // 1. Join user room
    socket.emit("join", userId);
    console.log("Joining socket room for:", userId);
    socket.emit("join", userId);

    // 2. Listen for new notifications
    socket.on("notification", (payload: Notification) => {
      setNotifications((prev) => [payload, ...prev]);
      console.log("New notification received:", payload);
    });

    return () => {
      socket.off("notification");
    };
  }, [socket, userId,refetch]);

  const handleToggle = () => {
    const opening = !open;
    setOpen(opening);

    if (opening && notifications.length > 0) {
      // 3. Mark all as read on server
      markAllAsRead(userId);
      // 4. Clear local unread count (or you could refetch)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button onClick={handleToggle} className="p-2" aria-label="Notifications">
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
          {notifications.length === 0 ? (
            <p className="text-center text-gray-500">No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="border-b last:border-none p-2 hover:bg-gray-100 cursor-pointer"
              >
                <p className="text-sm">{n.message}</p>
                <p className="text-[11px] text-gray-400">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const HomeIcon = ({ active }) => <img src="/assets/home.svg" />;
const StorageIcon = ({ active }) => <img src="/assets/storage.svg" />;
const OrderIcon = ({ active }) => <img src="/assets/cart.svg" />;
const ProfileIcon = ({ active }) => <img src="/assets/profile.svg" />;

export const NAV_ITEMS = [
  { label: "Home", Icon: HomeIcon, route: "/home" },
  { label: "Storage", Icon: StorageIcon, route: "/storage" },
  { label: "Order", Icon: OrderIcon, route: "/order" },
  { label: "Profile", Icon: ProfileIcon, route: "/profile" },
];

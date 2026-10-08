import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppAssets } from '../assets';

export type ScreenName =
  | 'Splash'
  | 'Onboarding'
  | 'LoginLanding'
  | 'SignIn'
  | 'CreateAccount'
  | 'ForgotPassword'
  | 'VerifyNumber'
  | 'ProfileSetup'
  | 'MainTabs'
  | 'TicketPlaces'
  | 'TicketBookingList'
  | 'TicketBookingDetail'
  | 'TicketAddons'
  | 'PaymentReceipt'
  | 'QRISPayment'
  | 'PaymentSuccess'
  | 'TravelRecap';

export type TabName = 'home' | 'calendar' | 'ticket' | 'promo' | 'profile';

export interface UserProfile {
  name: string;
  username: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  gender: string;
  balance: number;
  tier: string;
}

export interface TravelPlanState {
  destination: string;
  date: string;
  budget: string;
  numPeople: number;
  categories: {
    all: boolean;
    landmark: boolean;
    cullinary: boolean;
    nature: boolean;
    viral: boolean;
  };
}

export interface SavedPlan {
  id: string;
  name: string;
  destination: string;
  date: string;
  budget: string;
  numPeople: number;
  category: string;
  image: any;
  notes?: string;
}

export interface AddonItem {
  id: string;
  title: string;
  unitPrice: number;
  unitLabel: string;
  count: number;
}

export interface SplitUser {
  id: string;
  handle: string;
  role: string;
  avatarKey: string;
  selected: boolean;
}

export interface ScheduleItem {
  id: string;
  badge: 'Departure' | 'Return';
  date: string;
  from: string;
  to: string;
  depTime: string;
  arrTime: string;
  duration: string;
  vehicle: 'train' | 'bus';
  operator: string;
  seats: string;
  seatsColor: string;
  price: number;
}

export interface CompletedBooking {
  id: string;
  destination: string;
  date: string;
  fromCode: string;
  toCode: string;
  depTime: string;
  arrTime: string;
  duration: string;
  operator: string;
  passengers: string[];
  totalPrice: number;
  paymentMethod: string;
  status: 'Upcoming' | 'Completed';
  notes?: string;
}

interface AppContextType {
  currentScreen: ScreenName;
  currentTab: TabName;
  screenHistory: ScreenName[];
  navigate: (screen: ScreenName, tab?: TabName) => void;
  goBack: () => void;
  setTab: (tab: TabName) => void;

  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUser: (updated: Partial<UserProfile>) => void;
  resetUserData: () => void;

  onboardingStep: number;
  setOnboardingStep: (step: number) => void;
  profileStep: number;
  setProfileStep: (step: number) => void;

  // Travel Plan
  travelPlan: TravelPlanState;
  setTravelPlan: React.Dispatch<React.SetStateAction<TravelPlanState>>;

  // Saved Plans CRUD
  savedPlans: SavedPlan[];
  setSavedPlans: React.Dispatch<React.SetStateAction<SavedPlan[]>>;
  addSavedPlan: (plan: Omit<SavedPlan, 'id'>) => void;
  updateSavedPlan: (id: string, updated: Partial<SavedPlan>) => void;
  deleteSavedPlan: (id: string) => void;

  // Booking Flow
  selectedPlaceId: string;
  setSelectedPlaceId: (id: string) => void;

  selectedDepartureTicket: ScheduleItem;
  setSelectedDepartureTicket: React.Dispatch<React.SetStateAction<ScheduleItem>>;

  selectedReturnTicket: ScheduleItem | null;
  setSelectedReturnTicket: React.Dispatch<React.SetStateAction<ScheduleItem | null>>;

  // Passengers CRUD
  passengers: string[];
  setPassengers: React.Dispatch<React.SetStateAction<string[]>>;
  addPassenger: (name: string) => void;
  removePassenger: (index: number) => void;
  updatePassenger: (index: number, name: string) => void;

  // Addons CRUD
  addons: AddonItem[];
  setAddons: React.Dispatch<React.SetStateAction<AddonItem[]>>;
  addAddon: (item: Omit<AddonItem, 'id'>) => void;
  updateAddon: (id: string, updated: Partial<AddonItem>) => void;
  deleteAddon: (id: string) => void;

  // Split Users CRUD
  splitUsers: SplitUser[];
  setSplitUsers: React.Dispatch<React.SetStateAction<SplitUser[]>>;
  addSplitUser: (handle: string, role?: string) => void;
  updateSplitUser: (id: string, updated: Partial<SplitUser>) => void;
  deleteSplitUser: (id: string) => void;
  toggleSplitUser: (id: string) => void;

  paymentMethod: string;
  setPaymentMethod: (method: string) => void;

  // Bookings CRUD
  bookingHistory: CompletedBooking[];
  addBooking: (booking: CompletedBooking) => void;
  updateBooking: (id: string, updated: Partial<CompletedBooking>) => void;
  deleteBooking: (id: string) => void;
  lastBookingId: string;
}

const defaultTravelPlan: TravelPlanState = {
  destination: 'Malang',
  date: '20 April 2026',
  budget: 'Rp 12.000.000',
  numPeople: 4,
  categories: {
    all: true,
    landmark: true,
    cullinary: true,
    nature: true,
    viral: true,
  },
};

const initialAddons: AddonItem[] = [
  { id: '1', title: 'Photo Box', unitPrice: 50000, unitLabel: '/session', count: 1 },
  { id: '2', title: 'Drawing Upin & Ipin', unitPrice: 10000, unitLabel: '/pax', count: 4 },
  { id: '3', title: 'Photo with Monkey', unitPrice: 10000, unitLabel: '/session', count: 4 },
  { id: '4', title: 'Mie Ayam Kayutangan', unitPrice: 30000, unitLabel: '/pax', count: 4 },
];

const initialSplitUsers: SplitUser[] = [
  { id: '1', handle: '@elviruy', role: 'Bintang Tamu', avatarKey: 'avatarElviruy', selected: true },
  { id: '2', handle: '@Dheayuk', role: 'Spotlight', avatarKey: 'avatarDheayuk', selected: true },
  { id: '3', handle: '@yaasminn', role: 'Bintang Tamu', avatarKey: 'avatarYaasminn', selected: true },
  { id: '4', handle: '@zhafran', role: 'Topping Keceee', avatarKey: 'avatarZhafran', selected: true },
];

const initialDepartureTicket: ScheduleItem = {
  id: '1',
  badge: 'Departure',
  date: '20 April 2026',
  from: 'MLG',
  to: 'BWI',
  depTime: '07.30',
  arrTime: '14:30',
  duration: '7h 30m',
  vehicle: 'train',
  operator: 'KAI  •  Panoramic Class',
  seats: '200 Seats Available',
  seatsColor: '#07a829',
  price: 150000,
};

const initialReturnTicket: ScheduleItem = {
  id: '2',
  badge: 'Return',
  date: '21 April 2026',
  from: 'BWI',
  to: 'MLG',
  depTime: '10.30',
  arrTime: '17:30',
  duration: '7h 30m',
  vehicle: 'train',
  operator: 'KAI  •  Panoramic Class',
  seats: '4 Seats Available',
  seatsColor: '#d32f2f',
  price: 150000,
};

const initialBookings: CompletedBooking[] = [
  {
    id: 'K3L455',
    destination: 'Kayutangan',
    date: '20 April 2026',
    fromCode: 'MLG',
    toCode: 'BWI',
    depTime: '07.30',
    arrTime: '14:30',
    duration: '7h 30m',
    operator: 'KAI • Economy',
    passengers: ['Dhea Ayu', 'Elvira Sangadji'],
    totalPrice: 300000,
    paymentMethod: 'Mandiri Virtual Account',
    status: 'Upcoming',
  },
  {
    id: '5IGM4S',
    destination: 'Bromo',
    date: '21 April 2026',
    fromCode: 'BWI',
    toCode: 'MLG',
    depTime: '10.30',
    arrTime: '17:30',
    duration: '7h 30m',
    operator: 'KAI • Economy',
    passengers: ['Yaasmin', 'Zhafran'],
    totalPrice: 300000,
    paymentMethod: 'T-Split Bill',
    status: 'Upcoming',
  },
];

const initialSavedPlans: SavedPlan[] = [
  {
    id: '1',
    name: 'Inggris',
    destination: 'London, UK',
    date: '10-15 Mei 2026',
    budget: 'Rp 25.000.000',
    numPeople: 2,
    category: 'Landmark',
    image: AppAssets.planInggris,
    notes: 'Kunjungi Big Ben & London Eye',
  },
  {
    id: '2',
    name: 'Paris',
    destination: 'Paris, France',
    date: '20-25 Juni 2026',
    budget: 'Rp 30.000.000',
    numPeople: 2,
    category: 'Landmark',
    image: AppAssets.planParis,
    notes: 'Tour Eiffel & Louvre Museum',
  },
  {
    id: '3',
    name: 'Jerman',
    destination: 'Berlin, Germany',
    date: '1-6 Juli 2026',
    budget: 'Rp 28.000.000',
    numPeople: 4,
    category: 'Landmark',
    image: AppAssets.planJerman,
    notes: 'Jalan-jalan di Brandenburg Gate',
  },
  {
    id: '4',
    name: 'Gondanglegi',
    destination: 'Gondanglegi, Malang',
    date: '15 April 2026',
    budget: 'Rp 500.000',
    numPeople: 4,
    category: 'Cullinary',
    image: AppAssets.planGondanglegi,
    notes: 'Wisata kuliner dan pasar tradisional',
  },
  {
    id: '5',
    name: 'Dau',
    destination: 'Dau, Malang',
    date: '22 April 2026',
    budget: 'Rp 450.000',
    numPeople: 4,
    category: 'Nature',
    image: AppAssets.planDau,
    notes: 'Petik jeruk dan santai di perbukitan',
  },
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Splash');
  const [currentTab, setCurrentTab] = useState<TabName>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenName[]>([]);

  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [profileStep, setProfileStep] = useState<number>(1);

  const [user, setUser] = useState<UserProfile>({
    name: 'Yaasmin',
    username: 'Yaasmin',
    phone: '+62 812 8976 9946',
    email: 'priasigma@gmail.com',
    address: 'Malang, Jawa Timur',
    dob: '11 Mei 2002',
    gender: 'Female',
    balance: 150000,
    tier: 'Platinum Member',
  });

  const [travelPlan, setTravelPlan] = useState<TravelPlanState>(defaultTravelPlan);
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(initialSavedPlans);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('kayutangan');
  const [selectedDepartureTicket, setSelectedDepartureTicket] = useState<ScheduleItem>(initialDepartureTicket);
  const [selectedReturnTicket, setSelectedReturnTicket] = useState<ScheduleItem | null>(initialReturnTicket);
  const [passengers, setPassengers] = useState<string[]>([
    'Dhea Ayu',
    'Elvira Sangadji',
    'Yaasmini',
    'Zhafran',
  ]);

  const [addons, setAddons] = useState<AddonItem[]>(initialAddons);
  const [splitUsers, setSplitUsers] = useState<SplitUser[]>(initialSplitUsers);
  const [paymentMethod, setPaymentMethod] = useState<string>('T-Split Bill');
  const [bookingHistory, setBookingHistory] = useState<CompletedBooking[]>(initialBookings);
  const [lastBookingId, setLastBookingId] = useState<string>('5V43KF');

  // Plan CRUD
  const addSavedPlan = (plan: Omit<SavedPlan, 'id'>) => {
    const newPlan: SavedPlan = {
      ...plan,
      id: Date.now().toString(),
      image: plan.image || AppAssets.ticketPlaceKayutangan,
    };
    setSavedPlans((prev) => [newPlan, ...prev]);
  };

  const updateSavedPlan = (id: string, updated: Partial<SavedPlan>) => {
    setSavedPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteSavedPlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Passenger CRUD
  const addPassenger = (name: string) => {
    if (name.trim()) {
      setPassengers((prev) => [...prev, name.trim()]);
    }
  };

  const removePassenger = (index: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  const updatePassenger = (index: number, name: string) => {
    setPassengers((prev) => prev.map((p, i) => (i === index ? name : p)));
  };

  // Addons CRUD
  const addAddon = (item: Omit<AddonItem, 'id'>) => {
    const newItem: AddonItem = {
      ...item,
      id: Date.now().toString(),
    };
    setAddons((prev) => [...prev, newItem]);
  };

  const updateAddon = (id: string, updated: Partial<AddonItem>) => {
    setAddons((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
    );
  };

  const deleteAddon = (id: string) => {
    setAddons((prev) => prev.filter((a) => a.id !== id));
  };

  // Split Users CRUD
  const addSplitUser = (handle: string, role = 'Friend') => {
    const cleanHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const newUser: SplitUser = {
      id: Date.now().toString(),
      handle: cleanHandle,
      role: role,
      avatarKey: 'avatarYaasmin',
      selected: true,
    };
    setSplitUsers((prev) => [...prev, newUser]);
  };

  const updateSplitUser = (id: string, updated: Partial<SplitUser>) => {
    setSplitUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
    );
  };

  const deleteSplitUser = (id: string) => {
    setSplitUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const toggleSplitUser = (id: string) => {
    setSplitUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, selected: !u.selected } : u))
    );
  };

  // Booking CRUD
  const addBooking = (booking: CompletedBooking) => {
    setBookingHistory((prev) => [booking, ...prev]);
    setLastBookingId(booking.id);
  };

  const updateBooking = (id: string, updated: Partial<CompletedBooking>) => {
    setBookingHistory((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
  };

  const deleteBooking = (id: string) => {
    setBookingHistory((prev) => prev.filter((b) => b.id !== id));
  };

  // User Profile CRUD
  const updateUser = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const resetUserData = () => {
    setUser({
      name: 'Yaasmin',
      username: 'Yaasmin',
      phone: '+62 812 8976 9946',
      email: 'priasigma@gmail.com',
      address: 'Malang, Jawa Timur',
      dob: '11 Mei 2002',
      gender: 'Female',
      balance: 150000,
      tier: 'Platinum Member',
    });
    setBookingHistory(initialBookings);
    setSavedPlans(initialSavedPlans);
  };

  const navigate = (screen: ScreenName, tab?: TabName) => {
    setScreenHistory((prev) => [...prev, currentScreen]);
    setCurrentScreen(screen);
    if (tab) {
      setCurrentTab(tab);
    }
  };

  const goBack = () => {
    if (screenHistory.length > 0) {
      const prevScreen = screenHistory[screenHistory.length - 1];
      setScreenHistory((prev) => prev.slice(0, prev.length - 1));
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('MainTabs');
    }
  };

  const setTab = (tab: TabName) => {
    setCurrentTab(tab);
    if (currentScreen !== 'MainTabs') {
      setCurrentScreen('MainTabs');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        currentTab,
        screenHistory,
        navigate,
        goBack,
        setTab,
        user,
        setUser,
        updateUser,
        resetUserData,
        onboardingStep,
        setOnboardingStep,
        profileStep,
        setProfileStep,
        travelPlan,
        setTravelPlan,
        savedPlans,
        setSavedPlans,
        addSavedPlan,
        updateSavedPlan,
        deleteSavedPlan,
        selectedPlaceId,
        setSelectedPlaceId,
        selectedDepartureTicket,
        setSelectedDepartureTicket,
        selectedReturnTicket,
        setSelectedReturnTicket,
        passengers,
        setPassengers,
        addPassenger,
        removePassenger,
        updatePassenger,
        addons,
        setAddons,
        addAddon,
        updateAddon,
        deleteAddon,
        splitUsers,
        setSplitUsers,
        addSplitUser,
        updateSplitUser,
        deleteSplitUser,
        toggleSplitUser,
        paymentMethod,
        setPaymentMethod,
        bookingHistory,
        addBooking,
        updateBooking,
        deleteBooking,
        lastBookingId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Booking } from "./types";
import { DEFAULT_SUCURSAL_ID } from "./mock";

const USER_KEY = "jb.user";
const BOOKINGS_KEY = "jb.bookings";
const SUCURSAL_KEY = "jb.sucursal";

type Listener = () => void;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const EMPTY_BOOKINGS: Booking[] = [];

let bookingsRawCache: string | null | undefined = undefined;
let bookingsValueCache: Booking[] = EMPTY_BOOKINGS;

function readUser(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(USER_KEY);
}

function readSucursal(): string {
  if (typeof window === "undefined") return DEFAULT_SUCURSAL_ID;
  return window.localStorage.getItem(SUCURSAL_KEY) ?? DEFAULT_SUCURSAL_ID;
}

function readBookings(): Booking[] {
  if (typeof window === "undefined") return EMPTY_BOOKINGS;
  const raw = window.localStorage.getItem(BOOKINGS_KEY);
  if (raw === bookingsRawCache) return bookingsValueCache;
  bookingsRawCache = raw;
  if (!raw) {
    bookingsValueCache = EMPTY_BOOKINGS;
  } else {
    try {
      bookingsValueCache = JSON.parse(raw) as Booking[];
    } catch {
      bookingsValueCache = EMPTY_BOOKINGS;
    }
  }
  return bookingsValueCache;
}

function writeBookings(b: Booking[]) {
  const serialized = JSON.stringify(b);
  window.localStorage.setItem(BOOKINGS_KEY, serialized);
  bookingsRawCache = serialized;
  bookingsValueCache = b;
  emit();
}

export function setUser(phone: string) {
  window.localStorage.setItem(USER_KEY, phone);
  emit();
}

export function setSucursal(id: string) {
  window.localStorage.setItem(SUCURSAL_KEY, id);
  emit();
}

export function clearUser() {
  window.localStorage.removeItem(USER_KEY);
  window.localStorage.removeItem(BOOKINGS_KEY);
  bookingsRawCache = null;
  bookingsValueCache = EMPTY_BOOKINGS;
  emit();
}

export function addBooking(slotId: string, date: string, sucursalId: string) {
  const current = readBookings();
  if (current.some((b) => b.slotId === slotId && b.date === date && b.sucursalId === sucursalId)) return;
  writeBookings([...current, { slotId, date, sucursalId, bookedAt: new Date().toISOString() }]);
}

export function removeBooking(slotId: string, date: string, sucursalId: string) {
  const current = readBookings();
  writeBookings(
    current.filter((b) => !(b.slotId === slotId && b.date === date && b.sucursalId === sucursalId)),
  );
}

const SERVER_USER = null;
const SERVER_BOOKINGS: Booking[] = EMPTY_BOOKINGS;

export function useUser(): string | null {
  return useSyncExternalStore(subscribe, readUser, () => SERVER_USER);
}

export function useSucursal(): string {
  return useSyncExternalStore(subscribe, readSucursal, () => DEFAULT_SUCURSAL_ID);
}

export function useBookings(): Booking[] {
  return useSyncExternalStore(subscribe, readBookings, () => SERVER_BOOKINGS);
}

export function useHydrated(): boolean {
  const get = () => true;
  const getServer = () => false;
  return useSyncExternalStore(() => () => {}, get, getServer);
}

export function useStorageSync() {
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === USER_KEY || e.key === BOOKINGS_KEY || e.key === SUCURSAL_KEY) emit();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}

export type Sucursal = {
  id: string;
  name: string;
  address: string;
};

export type SlotTemplate = {
  id: string;
  dayOfWeek: number;
  time: string;
  capacity: number;
};

export type Booking = {
  slotId: string;
  date: string;
  sucursalId: string;
  bookedAt: string;
};

export type DaySlot = {
  templateId: string;
  date: string;
  time: string;
  capacity: number;
  taken: number;
  mine: boolean;
  sucursalId: string;
};

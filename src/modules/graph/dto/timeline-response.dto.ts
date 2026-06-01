export interface TimelineEventDto {
  id: string;
  type: string;
  label: string;
  description: string | null;
  dateStart: Date | null;
  dateEnd: Date | null;
}

export interface TimelineResponseDto {
  items: TimelineEventDto[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

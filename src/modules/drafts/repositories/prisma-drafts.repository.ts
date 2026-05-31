import { Injectable } from '@nestjs/common';
import { Draft, Prisma } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CreateDraftDto, DraftStatusDto } from '../dto/draft.dto';
import { DraftsRepository } from './drafts.repository';

@Injectable()
export class PrismaDraftsRepository implements DraftsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateDraftDto): Promise<Draft> {
    return this.prisma.draft.create({
      data: {
        ...data,
        rawResponse: data.rawResponse as Prisma.InputJsonValue,
      },
    });
  }

  findById(id: string): Promise<Draft | null> {
    return this.prisma.draft.findUnique({ where: { id } });
  }

  findMany(status?: DraftStatusDto): Promise<Draft[]> {
    return this.prisma.draft.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: DraftStatusDto): Promise<Draft> {
    return this.prisma.draft.update({ where: { id }, data: { status } });
  }
}

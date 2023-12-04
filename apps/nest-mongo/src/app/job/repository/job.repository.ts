import { Injectable } from '@nestjs/common';
import { Job } from './job.schema';

@Injectable()
export abstract class JobRepository {
  abstract findById(jobId: string): Promise<Job>;
  abstract create(job: Job): Promise<Job>;
  abstract update(jobId: string, job: Job): Promise<Job>;
}
import { Injectable } from '@nestjs/common';
import { JobRepository } from '../job.repository';
import { Job } from '../job.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class MongoDBJobRepository implements JobRepository {
  constructor(
    @InjectModel('Job') private jobModel: Model<Job>
  ) {}

  async findById(jobId: string): Promise<Job> {
    const selectedJob = await this.jobModel.findOne({ _id: new Types.ObjectId(jobId) });
    return selectedJob;
  }

  async create(job: Job): Promise<Job> {
    const createdJob = new this.jobModel(job);
    return await createdJob.save();
  }

  async update(jobId: string, job: Job): Promise<Job> {
    return await this.jobModel.findOneAndUpdate({ _id: new Types.ObjectId(jobId) }, {
      status: job.status,
      commandStatus: job.commandStatus.map(command => {
        return {
          ...command,
          status: job.status
        }
      })
    });
  }
}
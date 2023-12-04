import { Injectable } from '@nestjs/common';
import { JobRepository } from '../job/repository/job.repository';
import { JobErrors } from './job.error';
import { UseCase } from './usecase';
import { Either, left, right } from 'fp-ts/Either';
import { Job } from '../job/repository/job.schema';
import { FindJobDTO } from '../job/dto/find-job.dto';
import { UpdateJobDTO } from '../job/dto/update-job.dto';

type UpdatedJob = {
  jobId: string;
  status: string;
}

type UpdateJobUseCaseResponse = Either<
  JobErrors.JobNotFound,
  UpdatedJob
> 

@Injectable()
export class UpdateJobUseCase implements UseCase<UpdateJobDTO, Promise<UpdateJobUseCaseResponse>> {
  constructor(
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(request: UpdateJobDTO): Promise<UpdateJobUseCaseResponse> {
    const { jobId, status } = request;
    if (!jobId) return left(JobErrors.ParameterMissing.create(['jobId']));
    const findJob = await this.jobRepository.findById(jobId);
    if (!findJob) return left(JobErrors.JobNotFound.create(jobId));

    await this.jobRepository.update(jobId, {
      ...findJob,
      commandStatus: findJob.commandStatus.map(command => {
        return {
          ...command,
          status,
        }
      }),
      status,
    })

    return right({ jobId, status })
  }
}
import { Injectable } from '@nestjs/common';
import { JobRepository } from '../job/repository/job.repository';
import { JobErrors } from './job.error';
import { UseCase } from './usecase';
import { Either, left, right } from 'fp-ts/Either';
import { Job } from '../job/repository/job.schema';
import { FindJobDTO } from '../job/dto/find-job.dto';


type FindJobUseCaseResponse = Either<
  JobErrors.JobNotFound,
  Job
> 

@Injectable()
export class FindJobUseCase implements UseCase<FindJobDTO, Promise<FindJobUseCaseResponse>> {
  constructor(
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(request: FindJobDTO): Promise<FindJobUseCaseResponse> {
    const { jobId } = request;
    if (!jobId) return left(JobErrors.ParameterMissing.create(['jobId']));

    try {
      const findJob = await this.jobRepository.findById(jobId);
      if (!findJob) return left(JobErrors.JobNotFound.create(jobId));
  
      return right(findJob)
    } catch (error) {
      return left(error);
    }
  }
}
import { Injectable } from '@nestjs/common';
import { CreateJobDTO } from '../job/dto/create-job.dto';
import { JobRepository } from '../job/repository/job.repository';
import { Node, NodeRepository } from '../node/repository/node.repository';
import { JobErrors } from './job.error';
import { UseCase } from './usecase';
import { Either, left, right } from 'fp-ts/Either';
import { Types } from 'mongoose';

type JobId = {
  jobId: string;
}

type CreateJobUseCaseResponse = Either<
  JobErrors.JobNotFound | JobErrors.NodeNotFound | JobErrors.ParameterMissing,
  JobId
> 

@Injectable()
export class CreateJobUseCase implements UseCase<CreateJobDTO, Promise<CreateJobUseCaseResponse>> {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly nodeRepository: NodeRepository,
  ) {}

  async execute(request: CreateJobDTO): Promise<CreateJobUseCaseResponse> {
    const { metaData, targetNodes } = request;
    if (!metaData || !targetNodes) return left(JobErrors.ParameterMissing.create(['metaData', 'targetNodes']));
    const nodePromises: Node[] = [];
    request.targetNodes.forEach(nodeIdentifier => {
      nodePromises.push(this.nodeRepository.getNodeByIdentifier(nodeIdentifier))
    })
    const findNodes = (await Promise.all(nodePromises)).filter(node => node);
    const notFoundNodes = request.targetNodes.filter(nodeIdentifier => !findNodes.map(node => node.nodeIdentifier).includes(nodeIdentifier))
    if (notFoundNodes.length > 0) return left(JobErrors.NodeNotFound.create(notFoundNodes));

    try {
      const createdJob = await this.jobRepository.create({
        _id: new Types.ObjectId(),
        trialNo: 1,
        isAlertRaised: false,
        isMultiTiered: false,
        isCMSync: false,
        targets: request.targetNodes,
        status: 'pending',
        metaData: request.metaData.map(meta => {
          return {
            type: meta.type
          }
        }),
        deleted: false,
        commandStatus: findNodes.map((node) => {
          return {
            nodeId: node.nodeId,
            nodeIdentifier: node.nodeIdentifier,
            status: 'pending',
            updatedAt: new Date(),
          }
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
        // _v: 0,
      })
  
      return right({ jobId: createdJob._id.toString() })
    } catch (error) {
      return left(error);
    }
  }
}
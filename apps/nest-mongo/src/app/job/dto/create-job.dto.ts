import { JobMetadata } from '../repository/job.schema';

export class CreateJobDTO {
  metaData: Array<JobMetadata>;
  targetNodes: Array<string>;
}
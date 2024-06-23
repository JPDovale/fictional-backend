import { Module } from '@nestjs/common'
import { GetPersonAttributeService } from './services/GetPersonAttribute.service'
import { DatabaseModule } from '@infra/database/Database.module'
import { GetPersonAttributeController } from './controllers/GetPersonAttribute.controller'
import { ErrorPresenter } from '@infra/presenters/Error.presenter'
import { AttributePresenter } from './presenters/Attribute.presenter'
import { DeletePersonAttributeService } from './services/DeletePersonAttribute.service'
import { DeletePersonAttributeController } from './controllers/DeletePersonAttribute.controller'
import { EmptyPresenter } from '@infra/presenters/Empty.presente'
import { GetPersonService } from './services/GetPerson.service'
import { GetPersonController } from './controllers/GetPerson.controller'
import { PersonWithDetailsPresenter } from './presenters/PersonWithDetails.presenter'
import { UpdatePersonService } from './services/UpdatePerson.service'
import { CreateAffiliationService } from '@modules/affiliations/services/CreateAffiliation.service'
import { GetAffiliationByParentsIdService } from '@modules/affiliations/services/GetAffiliationByParentsId.service'
import { UpdateBirthAndDeathDateOfPersonInDefaultTimelineService } from '@modules/timelines/services/UpdateBirthAndDeathDateOfPersonInDefaultTimeline.service'
import { UpdateAllPersonEventsService } from '@modules/timelines/services/UpdateAllPersonEvents.service'
import { UpdatePersonController } from './controllers/UpdatePerson.controller'
import { PersonPresenter } from './presenters/Person.presenter'
import { GetPersonsService } from './services/GetPersons.service'
import { GetPersonsController } from './controllers/GetPersons.controller'
import { PersonWithParentsPresenter } from './presenters/PersonWithParents.presenter'
import { GetAttributesPreviewService } from './services/GetAttributesPreview.service'
import { GetAttributesPreviewController } from './controllers/GetAttributesPreview.controller'
import { AttributePreviewPresenter } from './presenters/AttributesPreview.presenter'
import { CreatePersonService } from './services/CreatePerson.service'
import { CreatePersonController } from './controllers/CreatePerson.controller'
import { CreateManyPersonEventsForDefaultTimelineService } from '@modules/timelines/services/CreateManyPersonEventsForDefaultTimeline.service'
import { DeletePersonService } from './services/DeletePerson.service'
import { DeletePersonController } from './controllers/DeletePerson.controller'
import { CreatePersonAttributeService } from './services/CreatePersonAttribute.service'
import { CreatePersonAttributeController } from './controllers/CreatePersonAttribute.controller'
import { CreatePersonAttributeMutationController } from './controllers/CreatePersonAttributeMutation.controller'
import { CreatePersonAttributeMutationService } from './services/CreatePersonAttributeMutation.service'
import { ChangePositionPersonAttributeMutationService } from './services/ChagePositionPersonAttributeMutation.service'
import { ChangePositionPersonAttributeMutationController } from './controllers/ChangePositionPersonAttributeMutation.controller'
import { DeletePersonAttributeMutationService } from './services/DeletePersonAttributeMutation.service'
import { UpdatePersonAttributeMutationService } from './services/UpdatePersonAttributeMutation.service'
import { DeletePersonAttributeMutationController } from './controllers/DeletePersonAttributeMutation.controller'
import { UpdatePersonAttributeMutationController } from './controllers/UpdatePersonAttributeMutation.controller'
import { TextModule } from '@providers/text/Text.module'

@Module({
  imports: [DatabaseModule, TextModule],
  controllers: [
    GetPersonAttributeController,
    DeletePersonAttributeController,
    GetPersonController,
    UpdatePersonController,
    GetPersonsController,
    GetAttributesPreviewController,
    CreatePersonController,
    DeletePersonController,
    CreatePersonAttributeController,
    CreatePersonAttributeMutationController,
    ChangePositionPersonAttributeMutationController,
    DeletePersonAttributeMutationController,
    UpdatePersonAttributeMutationController,
  ],
  providers: [
    GetPersonAttributeService,
    DeletePersonAttributeService,
    GetPersonService,
    UpdatePersonService,
    CreateAffiliationService,
    GetAffiliationByParentsIdService,
    UpdateBirthAndDeathDateOfPersonInDefaultTimelineService,
    UpdateAllPersonEventsService,
    GetPersonsService,
    GetAttributesPreviewService,
    CreatePersonService,
    CreateManyPersonEventsForDefaultTimelineService,
    DeletePersonService,
    CreatePersonAttributeService,
    CreatePersonAttributeMutationService,
    ChangePositionPersonAttributeMutationService,
    DeletePersonAttributeMutationService,
    UpdatePersonAttributeMutationService,

    ErrorPresenter,
    EmptyPresenter,
    AttributePresenter,
    PersonPresenter,
    PersonWithDetailsPresenter,
    PersonWithParentsPresenter,
    AttributePreviewPresenter,
  ],
})
export class PersonsModule {}

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * Consent transaction for sharing a data asset with a practitioner
 * @param {org.cc.patientdatanetwork.ShareWithPractitioner} ShareWithPractitioner
 * @transaction
 */
async function ShareWithPractitioner(tx) {
    // Get the Procedure asset + and share with practitioner.
    let practitionerId = tx.practitioner.participantId;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry(tx.assetType);
    let asset = await assetRegistry.get(tx.assetReference);
    await console.log('all the', tx.assetType, ' items are ', tx.assetReference);

    if (asset.practitionersWithAccess) {
        if (asset.practitionersWithAccess.indexOf(practitionerId) > -1) {
            console.log('Asset ' + asset.assetId + ' is already shared with ' + tx.practitioner.firstName);
        }
        else {
            // add practitioner ID to practitionersWithAccess array
            asset.practitionersWithAccess.push(practitionerId);
        }
    }
    else {
        console.log('You are sharing this item for the first time');
        asset.practitionersWithAccess = [practitionerId];
    }
    // Update the asset in the asset registry.
    await assetRegistry.update(asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.cc.patientdatanetwork', 'AssetSharedwithPractitioner');
    event.assetType = tx.assetType;
    event.assetReference = tx.assetReference;
    event.practitioner = tx.practitioner;
    emit(event);
}

/**
 * ORGANIZATION SHARING
 * ====================
 * The sections below share patient data assets to organizations
 */


/**
 * Consent transaction for a data asset with an Org
 * @param {org.cc.patientdatanetwork.ShareWithOrg} ShareWithOrg
 * @transaction
 */
async function ShareWithOrg(tx) {
    // Get the Medication asset + share with new practitioner.
    let organizationId = tx.organization.organizationId;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry(tx.assetType);
    let asset = await assetRegistry.get(tx.assetReference);

    if (asset.orgsWithAccess) {
        if (asset.orgsWithAccess.indexOf(organizationId) > -1) {
            console.log('Asset ' + asset.assetId + ' is already shared with ' + tx.organization.name);
        }
        else {
            // add practitioner ID to orgsWithAccess array
            asset.orgsWithAccess.push(organizationId);
        }
    }
    else {
        console.log('You are sharing this item for the first time');
        asset.orgsWithAccess = [organizationId];
    }

    // Update the asset in the asset registry.
    await assetRegistry.update(asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.cc.patientdatanetwork', 'AssetSharedWithOrg');
    event.assetType = tx.assetType;
    event.assetReference = tx.assetReference;
    event.organization = tx.organization;
    emit(event);
}

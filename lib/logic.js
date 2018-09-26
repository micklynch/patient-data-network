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
 * Consent transaction for Medication
 * @param {org.cc.patientdatanetwork.TransferMedicationConsentToProvider} TransferMedicationConsentToProvider
 * @transaction
 */
async function TransferMedicationConsentToProvider(tx) {
    // Get the Medication asset + share with new provider.
    let asset = tx.asset;
    let providerId = tx.provider.participantId;

    if (asset.providersWithAccess) {
        if (asset.providersWithAccess.indexOf(providerId) > -1) {
            console.log('Asset ' + tx.asset.detail + ' is already shared with ' + tx.provider.firstName);
        }
        else {
            // add provider ID to providersWithAccess array
            asset.providersWithAccess.push(providerId);
        }
    }
    else {
        console.log('You are sharing this item for the first time');
        asset.providersWithAccess = [providerId];
    }
    // Update the registry
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.cc.patientdatanetwork.Medication');

    // Update the asset in the asset registry.
    await assetRegistry.update(asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.cc.patientdatanetwork', 'ItemSharedwithProvider');
    event.asset = asset;
    event.provider = tx.provider;
    emit(event);
}

/**
 * Consent transaction for Procedure
 * @param {org.cc.patientdatanetwork.TransferProcedureConsentToProvider} TransferProcedureConsentToProvider
 * @transaction
 */
async function TransferProcedureConsentToProvider(tx) {
    // Get the Procedure asset + and share with new provider.
    let asset = tx.asset;
    let providerId = tx.provider.participantId;

    if (asset.providersWithAccess) {
        if (asset.providersWithAccess.indexOf(providerId) > -1) {
            console.log('Asset ' + tx.asset.detail + ' is already shared with ' + tx.provider.firstName);
        }
        else {
            // add provider ID to providersWithAccess array
            asset.providersWithAccess.push(providerId);
        }
    }
    else {
        console.log('You are sharing this item for the first time');
        asset.providersWithAccess = [providerId];
    }
    // Update the registry
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.cc.patientdatanetwork.Procedure');

    // Update the asset in the asset registry.
    await assetRegistry.update(asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.cc.patientdatanetwork', 'MedicationSharedwithProvider');
    event.asset = asset;
    event.provider = tx.provider;
    emit(event);
}

/**
 * ORGANIZATION SHARING
 * ====================
 * The sections below share patient data assets to organizations
 */


/**
 * Consent transaction for Medication
 * @param {org.cc.patientdatanetwork.TransferMedicationConsentToOrg} TransferMedicationConsentToOrg
 * @transaction
 */
async function TransferMedicationConsentToOrg(tx) {
    // Get the Medication asset + share with new provider.
    let asset = tx.asset;
    let organizationId = tx.organization.organizationId;

    if (asset.orgsWithAccess) {
        if (asset.orgsWithAccess.indexOf(organizationId) > -1) {
            console.log('Asset ' + tx.asset.detail + ' is already shared with ' + tx.organization.name);
        }
        else {
            // add provider ID to orgsWithAccess array
            asset.orgsWithAccess.push(organizationId);
        }
    }
    else {
        console.log('You are sharing this item for the first time');
        asset.orgsWithAccess = [organizationId];
    }
    // Update the registry
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.cc.patientdatanetwork.Medication');

    // Update the asset in the asset registry.
    await assetRegistry.update(asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.cc.patientdatanetwork', 'MedicationSharedWithOrg');
    event.asset = asset;
    event.organization = tx.organization;
    emit(event);
}

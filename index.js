const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const exec = require('@actions/exec');

async function checkIfResourceGroupExists(resourceGroup) {
    /**
     * Check if the resource group exists.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the resource group exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };
        // Execute the Azure CLI command
        await exec.exec(`az group show --name ${resourceGroup} --resource-group ${resourceGroup}`, [], options);

        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false; // Return false if the workspace does not exist
    }
}

async function checkIfWorkspaceExists(workspaceName, resourceGroup) {
    /**
     * Check if the workspace exists in the specified resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the workspace exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml workspace show --name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function checkIfRegistryExists(registryName, resourceGroup) {
    /**
     * Check if the registry exists in the specified resource group.
     * @param {string} registryName - The name of the registry.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the registry exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml registry show --name ${registryName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Registry Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Registry Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function checkIfModelInRegistryExists(
    modelName, modelVersion, registryName, resourceGroup
) {
    /**
     * Check if the model exists in the specified registry.
     * @param {string} modelName - The name of the model.
     * @param {string} modelVersion - The version of the model.
     * @param {string} registryName - The name of the registry.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the model exists, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if model exists in registry
        await exec.exec(`az ml model show --name ${modelName} --version ${modelVersion} --registry-name ${registryName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Model Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Model Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function checkIfModelInWorkspaceExists(
    modelName, modelVersion, workspaceName, resourceGroup
) {
    /**
     * Check if the model exists in the specified workspace.
     * @param {string} modelName - The name of the model.
     * @param {string} modelVersion - The version of the model.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the model exists, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if model exists in registry
        await exec.exec(`az ml model show --name ${modelName} --version ${modelVersion} --workspace-name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Model Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Model Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function moveModelToRegistry(
    modelName,
    modelVersion,
    sourceWorkSpaceName,
    sourceResourceGroup,
    destinationRegistryName,
) {
    /**
     * Move the model from the source registry to the destination registry.
     * @param {string} modelName - The name of the model.
     * @param {string} modelVersion - The version of the model.
     * @param {string} sourceWorkSpaceName - The name of the source workspace.
     * @param {string} sourceRegistryResourceGroup - The resource group of the source registry.
     * @param {string} destinationRegistryName - The name of the destination registry.
     * @param {string} destinationRegistryResourceGroup - The resource group of the destination registry.
     * @return {boolean} - Returns true if the model is moved successfully, false otherwise.
     * */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Move the model to the destination registry
        await exec.exec(`az ml model share --name ${modelName} --version ${modelVersion} --resource-group ${sourceResourceGroup} --workspace-name ${sourceWorkSpaceName} --share-with-name ${modelName} --share-with-version ${modelVersion} --registry-name ${destinationRegistryName}`, [], options);
        console.log("✅ Model Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Model Move Failed or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

try {
    // const sourceWorkspaceName = core.getInput("source_workspace_name");
    // const sourceRegistryName = core.getInput("source_registry_name");
    // const destinationRegistryName = core.getInput("destination_registry_name");
    // const destinationRegistryResourceGroup = core.getInput("destination_registry_resource_group");
    // const modelName = core.getInput("model_name");
    // const modelVersion = core.getInput("model_version");

    const sourceRegistryName = core.getInput("source_registry_name");
    const sourceWorkspaceName = core.getInput("source_workspace_name");
    const sourceResourceGroup = core.getInput("source_resource_group");
    const destinationResourceGroup = core.getInput("destination_resource_group");
    const destinationRegistryName = core.getInput("destination_registry_name");
    const destinationRegistryResourceGroup = core.getInput("destination_registry_resource_group");
    const modelName = core.getInput("model_name");
    const modelVersion = core.getInput("model_version");

    if (!sourceResourceGroup) {
        throw new Error("Source registry resource group is required");
    }

    if (!sourceWorkspaceName) {
        throw new Error("Source workspace name is required");
    }

    if (!destinationRegistryName) {
        throw new Error("Destination registry name is required");
    }

    if (!destinationResourceGroup) {
        throw new Error("Destination registry resource group is required");
    }

    if (!modelName) {
        throw new Error("Model name is required");
    }

    if (!modelVersion) {
        throw new Error("Model version is required");
    }

    // Check if the resource group exists
    console.log(`🔹 Checking if resource group '${sourceResourceGroup}' exists...`)
    ;
    let resourceGroupExists = await checkIfResourceGroupExists(sourceResourceGroup);

    if (!resourceGroupExists) {
        throw new Error(`Resource group '${sourceResourceGroup}' does not exist.`);
    } else {
        console.log(`✅ Resource group '${sourceResourceGroup}' exists.`);
    }

    console.log(`🔹 Checking if destination resource group '${destinationResourceGroup}' exists...`)
    ;
    resourceGroupExists = await checkIfResourceGroupExists(destinationResourceGroup);

    if (!resourceGroupExists) {
        throw new Error(`Resource group '${destinationResourceGroup}' does not exist.`);
    } else {
        console.log(`✅ Resource group '${destinationResourceGroup}' exists.`);
    }

    // Check if the source workspace exists
    console.log(`🔹 Checking if workspace '${sourceWorkspaceName}' exists in resource group '${sourceResourceGroup}'...`)
    ;
    const workspaceExists = await checkIfWorkspaceExists(sourceWorkspaceName, sourceResourceGroup);

    if (!workspaceExists) {
        throw new Error(`Workspace '${sourceWorkspaceName}' does not exist in resource group '${sourceResourceGroup}'.`);
    } else {
        console.log(`✅ Workspace '${sourceWorkspaceName}' exists in resource group '${sourceResourceGroup}'.`);
    }

    // Check if the destination registry exists
    console.log(`🔹 Checking if registry '${destinationRegistryName}' exists in resource group '${destinationRegistryResourceGroup}'...`);

    const registryExists = await checkIfRegistryExists(destinationRegistryName, destinationRegistryResourceGroup);

    if (!registryExists) {
        throw new Error(`Registry '${destinationRegistryName}' does not exist in resource group '${destinationRegistryResourceGroup}'.`);
    }
    else {
        console.log(`✅ Registry '${destinationRegistryName}' exists in resource group '${destinationRegistryResourceGroup}'.`);
    }

    // Check if model exists in registry
    if(sourceRegistryName !== undefined) {
        console.log(`🔹 Checking if model '${modelName}' exists in workspace '${sourceWorkspaceName}'...`);

        const modelInRegistryExists = await checkIfModelInWorkspaceExists(
            modelName, modelVersion, sourceWorkspaceName, sourceResourceGroup
        );

        if (!modelInRegistryExists) {
            throw new Error(`Model '${modelName}' does not exist in workspace '${sourceWorkspaceName}'.`);
        } else {
            console.log(`✅ Model '${modelName}' exists in workspace '${sourceWorkspaceName}'.`);
        }
    }

    // Move the model to the destination registry
    console.log(`🔹 Moving model '${modelName}' to registry '${destinationRegistryName}'...`)
    const modelMoved = await moveModelToRegistry(
        modelName, modelVersion, sourceWorkspaceName, sourceResourceGroup, destinationRegistryName
    );
    if (!modelMoved) {
        throw new Error(`Failed to move model '${modelName}' to registry '${destinationRegistryName}'.`);
    } else {
        console.log(`✅ Model '${modelName}' moved to registry '${destinationRegistryName}'.`);
    }
} catch (error) {
    console.log(error.message);
    core.setFailed(`❌ Action failed: ${error.message}`);
}

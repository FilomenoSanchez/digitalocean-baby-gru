var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
// @ts-ignore
importScripts('./wasm/moorhen.js');
// @ts-ignore
importScripts('./wasm/web_example.js');
var cootModule;
var molecules_container;
var ccp4Module;
var guid = function () {
    var d = Date.now();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
};
// @ts-ignore
var print = function (stuff) {
    console.log(stuff);
    postMessage({ consoleMessage: JSON.stringify(stuff) });
};
var instancedMeshToMeshData = function (instanceMesh, perm, toSpheres, maxZSize) {
    //maxZSize is arguably a hack to deal with overlong bonds. It is set to 5 incall to this function.
    if (toSpheres === void 0) { toSpheres = false; }
    if (maxZSize === void 0) { maxZSize = 10000.; }
    var totIdxs = [];
    var totPos = [];
    var totNorm = [];
    var totInstance_sizes = [];
    var totInstance_colours = [];
    var totInstance_origins = [];
    var totInstance_orientations = [];
    var totInstanceUseColours = [];
    var totInstancePrimTypes = [];
    var geom = instanceMesh.geom;
    var markup = instanceMesh.markup;
    var geomSize = geom.size();
    for (var i = 0; i < geomSize; i++) {
        var thisToSpheres = toSpheres;
        var thisIdxs = [];
        var thisPos = [];
        var thisNorm = [];
        var thisInstance_sizes = [];
        var thisInstance_colours = [];
        var thisInstance_origins = [];
        var thisInstance_orientations = [];
        var inst = geom.get(i);
        if (inst.name === "spherical-atoms")
            thisToSpheres = true;
        var vertices = inst.vertices;
        var triangles = inst.triangles;
        var trianglesSize = triangles.size();
        for (var i_1 = 0; i_1 < trianglesSize; i_1++) {
            var triangle = triangles.get(i_1);
            var idxs = triangle.point_id;
            if (perm) {
                thisIdxs.push(idxs[0]);
                thisIdxs.push(idxs[2]);
                thisIdxs.push(idxs[1]);
            }
            else {
                thisIdxs.push(idxs[0]);
                thisIdxs.push(idxs[1]);
                thisIdxs.push(idxs[2]);
            }
        }
        triangles["delete"]();
        var verticesSize = vertices.size();
        for (var i_2 = 0; i_2 < verticesSize; i_2++) {
            var vert = vertices.get(i_2);
            var vertPos = vert.pos;
            thisPos.push(vertPos[0]);
            thisPos.push(vertPos[1]);
            thisPos.push(vertPos[2]);
            var vertNormal = vert.normal;
            thisNorm.push(vertNormal[0]);
            thisNorm.push(vertNormal[1]);
            thisNorm.push(vertNormal[2]);
            vert["delete"]();
        }
        vertices["delete"]();
        var As = inst.instancing_data_A;
        var Asize = As.size();
        if (Asize > 0) {
            for (var j = 0; j < Asize; j++) {
                var inst_data = As.get(j);
                var instDataPosition = inst_data.position;
                thisInstance_origins.push(instDataPosition[0]);
                thisInstance_origins.push(instDataPosition[1]);
                thisInstance_origins.push(instDataPosition[2]);
                var instDataColour = inst_data.colour;
                thisInstance_colours.push(instDataColour[0]);
                thisInstance_colours.push(instDataColour[1]);
                thisInstance_colours.push(instDataColour[2]);
                thisInstance_colours.push(instDataColour[3]);
                var instDataSize = inst_data.size;
                thisInstance_sizes.push(instDataSize[0]);
                thisInstance_sizes.push(instDataSize[1]);
                thisInstance_sizes.push(instDataSize[2]);
                thisInstance_orientations.push.apply(thisInstance_orientations, [
                    1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0,
                ]);
                inst_data["delete"]();
            }
        }
        As["delete"]();
        var Bs = inst.instancing_data_B;
        var Bsize = Bs.size();
        if (Bsize > 0) {
            for (var j = 0; j < Bsize; j++) {
                var inst_data = Bs.get(j);
                var instDataSize = inst_data.size;
                if (instDataSize[2] > maxZSize)
                    continue;
                thisInstance_sizes.push(instDataSize[0]);
                thisInstance_sizes.push(instDataSize[1]);
                thisInstance_sizes.push(instDataSize[2]);
                var instDataPosition = inst_data.position;
                thisInstance_origins.push(instDataPosition[0]);
                thisInstance_origins.push(instDataPosition[1]);
                thisInstance_origins.push(instDataPosition[2]);
                var instDataColour = inst_data.colour;
                thisInstance_colours.push(instDataColour[0]);
                thisInstance_colours.push(instDataColour[1]);
                thisInstance_colours.push(instDataColour[2]);
                thisInstance_colours.push(instDataColour[3]);
                var instDataOrientation = inst_data.orientation;
                thisInstance_orientations.push(instDataOrientation[0][0]);
                thisInstance_orientations.push(instDataOrientation[0][1]);
                thisInstance_orientations.push(instDataOrientation[0][2]);
                thisInstance_orientations.push(instDataOrientation[0][3]);
                thisInstance_orientations.push(instDataOrientation[1][0]);
                thisInstance_orientations.push(instDataOrientation[1][1]);
                thisInstance_orientations.push(instDataOrientation[1][2]);
                thisInstance_orientations.push(instDataOrientation[1][3]);
                thisInstance_orientations.push(instDataOrientation[2][0]);
                thisInstance_orientations.push(instDataOrientation[2][1]);
                thisInstance_orientations.push(instDataOrientation[2][2]);
                thisInstance_orientations.push(instDataOrientation[2][3]);
                thisInstance_orientations.push(instDataOrientation[3][0]);
                thisInstance_orientations.push(instDataOrientation[3][1]);
                thisInstance_orientations.push(instDataOrientation[3][2]);
                thisInstance_orientations.push(instDataOrientation[3][3]);
                inst_data["delete"]();
            }
        }
        Bs["delete"]();
        inst["delete"]();
        totNorm.push(thisNorm);
        totPos.push(thisPos);
        totIdxs.push(thisIdxs);
        totInstance_sizes.push(thisInstance_sizes);
        totInstance_origins.push(thisInstance_origins);
        totInstance_orientations.push(thisInstance_orientations);
        totInstance_colours.push(thisInstance_colours);
        totInstanceUseColours.push(true);
        if (thisToSpheres)
            totInstancePrimTypes.push("PERFECT_SPHERES");
        else
            totInstancePrimTypes.push("TRIANGLES");
    }
    geom["delete"]();
    var simpleMeshData = simpleMeshToMeshData(markup); // simpleMeshToMeshData should do the "delete"
    instanceMesh["delete"]();
    if (simpleMeshData.idx_tri.length > 0 && simpleMeshData.idx_tri[0].length > 0 && simpleMeshData.idx_tri[0][0].length > 0) {
        if (toSpheres) {
            return {
                prim_types: [totInstancePrimTypes, simpleMeshData.prim_types[0]],
                idx_tri: [totIdxs, simpleMeshData.idx_tri[0]],
                vert_tri: [totInstance_origins, simpleMeshData.vert_tri[0]],
                norm_tri: [totNorm, simpleMeshData.norm_tri[0]],
                col_tri: [totInstance_colours, simpleMeshData.col_tri[0]],
                instance_use_colors: [totInstanceUseColours, null],
                instance_sizes: [totInstance_sizes, null],
                instance_origins: [totInstance_origins, null],
                instance_orientations: [totInstance_orientations, null]
            };
        }
        else {
            return {
                prim_types: [totInstancePrimTypes, simpleMeshData.prim_types[0]],
                idx_tri: [totIdxs, simpleMeshData.idx_tri[0]],
                vert_tri: [totPos, simpleMeshData.vert_tri[0]],
                norm_tri: [totNorm, simpleMeshData.norm_tri[0]],
                col_tri: [totInstance_colours, simpleMeshData.col_tri[0]],
                instance_use_colors: [totInstanceUseColours, null],
                instance_sizes: [totInstance_sizes, null],
                instance_origins: [totInstance_origins, null],
                instance_orientations: [totInstance_orientations, null]
            };
        }
    }
    else {
        return {
            prim_types: [totInstancePrimTypes],
            idx_tri: [totIdxs],
            vert_tri: [totPos],
            norm_tri: [totNorm],
            col_tri: [totInstance_colours],
            instance_use_colors: [totInstanceUseColours],
            instance_sizes: [totInstance_sizes],
            instance_origins: [totInstance_origins],
            instance_orientations: [totInstance_orientations]
        };
    }
};
var simpleMeshToMeshData = function (simpleMesh, perm) {
    if (perm === void 0) { perm = false; }
    var vertices = simpleMesh.vertices;
    var triangles = simpleMesh.triangles;
    var totIdxs = [];
    var totPos = [];
    var totNorm = [];
    var totCol = [];
    var trianglesSize = triangles.size();
    for (var i = 0; i < trianglesSize; i++) {
        var triangle = triangles.get(i);
        var idxs = triangle.point_id;
        if (perm)
            totIdxs.push.apply(totIdxs, [idxs[0], idxs[2], idxs[1]]);
        else
            totIdxs.push.apply(totIdxs, idxs);
    }
    triangles["delete"]();
    var verticesSize = vertices.size();
    for (var i = 0; i < verticesSize; i++) {
        var vert = vertices.get(i);
        var vertPos = vert.pos;
        var vertNormal = vert.normal;
        var vertColor = vert.color;
        totPos.push.apply(totPos, vertPos);
        if (perm)
            totNorm.push.apply(totNorm, [-vertNormal[0], -vertNormal[1], -vertNormal[2]]);
        else
            totNorm.push.apply(totNorm, vertNormal);
        totCol.push.apply(totCol, vertColor);
        vert["delete"]();
    }
    vertices["delete"]();
    simpleMesh["delete"]();
    return {
        prim_types: [["TRIANGLES"]],
        idx_tri: [[totIdxs]],
        vert_tri: [[totPos]],
        norm_tri: [[totNorm]],
        col_tri: [[totCol]]
    };
};
var SuperposeResultsToJSArray = function (superposeResults) {
    var alignedPairsVec = superposeResults.aligned_pairs;
    var alignedPairsVecSize = alignedPairsVec.size();
    var alignedPairsData = [];
    for (var i = 0; i < alignedPairsVecSize; i++) {
        var alignedPairs = alignedPairsVec.get(i);
        var refResidueData = alignedPairs.first;
        var refResidueSpec = refResidueData.residue_spec;
        var movResidueData = alignedPairs.second;
        var movResidueSpec = movResidueData.residue_spec;
        var currentPairData = {
            reference: {
                chainId: refResidueSpec.chain_id,
                insCode: refResidueSpec.ins_code,
                seqNum: refResidueSpec.res_no,
                restype: "UNK",
                value: refResidueData.function_value,
                label: refResidueData.label
            },
            moving: {
                chainId: movResidueSpec.chain_id,
                insCode: movResidueSpec.ins_code,
                seqNum: movResidueSpec.res_no,
                restype: "UNK",
                value: movResidueData.function_value,
                label: movResidueData.label
            }
        };
        movResidueData["delete"]();
        movResidueSpec["delete"]();
        refResidueData["delete"]();
        refResidueSpec["delete"]();
        alignedPairsData.push(currentPairData);
    }
    alignedPairsVec["delete"]();
    return {
        referenceSequence: superposeResults.alignment.first,
        movingSequence: superposeResults.alignment.second,
        supperposeInfo: superposeResults.superpose_info,
        alignedPairsData: alignedPairsData
    };
};
var colourRulesToJSArray = function (colourRulesArray) {
    var returnResult = [];
    var colourRulesSize = colourRulesArray.size();
    for (var i = 0; i < colourRulesSize; i++) {
        var rule = colourRulesArray.get(i);
        returnResult.push(rule);
    }
    colourRulesArray["delete"]();
    return returnResult;
};
var floatArrayToJSArray = function (floatArray) {
    var returnResult = [];
    var floatArraySize = floatArray.size();
    for (var i = 0; i < floatArraySize; i++) {
        var f = floatArray.get(i);
        returnResult.push(f);
    }
    floatArray["delete"]();
    return returnResult;
};
var mapMoleculeCentreInfoToJSObject = function (mapMoleculeCentreInfo) {
    //Takes a coot::util::map_molecule_centre_info and returns a javascript object that resembles it
    //Disposes of the coordOrth
    var updatedCentre = mapMoleculeCentreInfo.updated_centre;
    var returnResult = {
        updated_centre: [
            updatedCentre.x(),
            updatedCentre.y(),
            updatedCentre.z()
        ],
        success: mapMoleculeCentreInfo.success,
        suggested_contour_level: mapMoleculeCentreInfo.suggested_contour_level
    };
    updatedCentre["delete"]();
    return returnResult;
};
var intArrayToJSArray = function (intArray) {
    var returnResult = [];
    var intArraySize = intArray.size();
    for (var i = 0; i < intArraySize; i++) {
        var f = intArray.get(i);
        returnResult.push(f);
    }
    intArray["delete"]();
    return returnResult;
};
var stringArrayToJSArray = function (stringArray) {
    var returnResult = [];
    var stringArraySize = stringArray.size();
    for (var i = 0; i < stringArraySize; i++) {
        var s = stringArray.get(i);
        returnResult.push(s);
    }
    stringArray["delete"]();
    return returnResult;
};
var symmetryToJSData = function (symmetryDataPair) {
    var result = [];
    var symmetryData = symmetryDataPair.first;
    var symmetryMatrices = symmetryDataPair.second;
    var cell = symmetryData.cell;
    var symm_trans = symmetryData.symm_trans;
    var symmetrySize = symm_trans.size();
    for (var i = 0; i < symmetrySize; i++) {
        var currentSymmetry = symm_trans.get(i);
        var symTransT = currentSymmetry.first;
        var cellTranslation = currentSymmetry.second;
        var currentSymmMat = symmetryMatrices.get(i);
        result.push({
            x: symTransT.x(),
            y: symTransT.y(),
            z: symTransT.z(),
            asString: symTransT.symm_as_string,
            isym: symTransT.isym(),
            us: cellTranslation.us,
            ws: cellTranslation.ws,
            vs: cellTranslation.vs,
            matrix: currentSymmMat
        });
        symTransT["delete"]();
    }
    cell["delete"]();
    symm_trans["delete"]();
    symmetryMatrices["delete"]();
    symmetryData["delete"]();
    return result;
};
var mmrrccStatsToJSArray = function (mmrrccStats) {
    var parseStats = function (stats) {
        var result = [];
        var residueSpecs = stats.keys();
        var mapSize = residueSpecs.size();
        for (var i = 0; i < mapSize; i++) {
            var residueSpec = residueSpecs.get(i);
            var densityCorrStat = stats.get(residueSpec);
            result.push({
                resNum: residueSpec.res_no,
                insCode: residueSpec.ins_code,
                modelNumber: residueSpec.model_number,
                chainId: residueSpec.chain_id,
                n: densityCorrStat.n,
                correlation: densityCorrStat.correlation()
            });
            residueSpec["delete"]();
            densityCorrStat["delete"]();
        }
        residueSpecs["delete"]();
        return result;
    };
    var first = mmrrccStats.first;
    var second = mmrrccStats.second;
    var returnResult = {
        "All atoms": parseStats(first),
        "Side-chains": parseStats(second)
    };
    first["delete"]();
    second["delete"]();
    return returnResult;
};
var residueSpecToJSArray = function (residueSpecs) {
    var returnResult = [];
    var residuesSize = residueSpecs.size();
    for (var ic = 0; ic < residuesSize; ic++) {
        var residue = residueSpecs.get(ic);
        returnResult.push({
            resNum: residue.res_no,
            insCode: residue.ins_code,
            modelNumber: residue.model_number,
            chainId: residue.chain_id
        });
        residue["delete"]();
    }
    residueSpecs["delete"]();
    return returnResult;
};
var validationDataToJSArray = function (validationData, chainID) {
    if (chainID === void 0) { chainID = null; }
    var returnResult = [];
    var cviv = validationData.cviv;
    var chainSize = cviv.size();
    for (var chainIndex = 0; chainIndex < chainSize; chainIndex++) {
        var chain = cviv.get(chainIndex);
        if (chainID !== null && chain.chain_id !== chainID) {
            // pass
        }
        else {
            var resInfo = chain.rviv;
            var resInfoSize = resInfo.size();
            for (var ir = 0; ir < resInfoSize; ir++) {
                var residue = resInfo.get(ir);
                var residueSpec = residue.residue_spec;
                returnResult.push({
                    chainId: residueSpec.chain_id,
                    insCode: residueSpec.ins_code,
                    seqNum: residueSpec.res_no,
                    restype: "UNK",
                    value: residue.function_value
                });
                residue["delete"]();
                residueSpec["delete"]();
            }
            resInfo["delete"]();
        }
        chain["delete"]();
    }
    cviv["delete"]();
    validationData["delete"]();
    return returnResult;
};
var linesBoxToJSArray = function (BoxData) {
    var envdata = [];
    var segments = BoxData.line_segments;
    var nSeg = segments.size();
    for (var i = 0; i < nSeg; i++) {
        var thisEnvdata = [];
        var segsI = segments.get(i);
        var nSegI = segsI.size();
        for (var j = 0; j < nSegI; j++) {
            var seg = segsI.get(j);
            var start = seg.getStart();
            var end = seg.getFinish();
            var ampl = seg.amplitude();
            var startJS = { x: start.x(), y: start.y(), z: start.z() };
            var endJS = { x: end.x(), y: end.y(), z: end.z() };
            thisEnvdata.push({
                start: startJS,
                end: endJS,
                dist: ampl
            });
            start["delete"]();
            end["delete"]();
            seg["delete"]();
        }
        segsI["delete"]();
        envdata.push(thisEnvdata);
    }
    segments["delete"]();
    BoxData["delete"]();
    return envdata;
};
var vectorHBondToJSArray = function (HBondData) {
    var hbdata = [];
    var hbondDataSize = HBondData.size();
    for (var ib = 0; ib < hbondDataSize; ib++) {
        var hb = HBondData.get(ib);
        hbdata.push({
            hb_hydrogen: hb.hb_hydrogen,
            donor: hb.donor,
            acceptor: hb.acceptor,
            donor_neigh: hb.donor_neigh,
            acceptor_neigh: hb.acceptor_neigh,
            angle_1: hb.angle_1,
            angle_2: hb.angle_2,
            angle_3: hb.angle_3,
            dist: hb.dist,
            ligand_atom_is_donor: hb.ligand_atom_is_donor,
            hydrogen_is_ligand_atom: hb.hydrogen_is_ligand_atom,
            bond_has_hydrogen_flag: hb.bond_has_hydrogen_flag
        });
    }
    HBondData["delete"]();
    return hbdata;
};
var interestingPlaceDataToJSArray = function (interestingPlaceData) {
    var returnResult = [];
    var interestingPlaceDataSize = interestingPlaceData.size();
    for (var ir = 0; ir < interestingPlaceDataSize; ir++) {
        var residue = interestingPlaceData.get(ir);
        var residueSpec = residue.residue_spec;
        returnResult.push({
            modelNumber: residueSpec.model_number,
            chainId: residueSpec.chain_id,
            insCode: residueSpec.ins_code,
            resNum: residueSpec.res_no,
            featureType: residue.feature_type,
            featureValue: residue.feature_value,
            buttonLabel: residue.button_label,
            badness: residue.badness,
            coordX: residue.x,
            coordY: residue.y,
            coordZ: residue.z
        });
        residue["delete"]();
        residueSpec["delete"]();
    }
    interestingPlaceData["delete"]();
    return returnResult;
};
var ramachandranDataToJSArray = function (ramachandraData, chainID) {
    var returnResult = [];
    var ramachandraDataSize = ramachandraData.size();
    for (var ir = 0; ir < ramachandraDataSize; ir++) {
        var residue = ramachandraData.get(ir);
        var phiPsi = residue.phi_psi;
        if (phiPsi.chain_id === chainID) {
            returnResult.push({
                chainId: phiPsi.chain_id,
                insCode: phiPsi.ins_code,
                seqNum: phiPsi.residue_number,
                restype: residue.residue_name(),
                isOutlier: !residue.is_allowed_flag,
                phi: phiPsi.phi(),
                psi: phiPsi.psi(),
                is_pre_pro: residue.residue_name() === 'PRO'
            });
        }
        residue["delete"]();
        phiPsi["delete"]();
    }
    ramachandraData["delete"]();
    return returnResult;
};
var simpleMeshToLineMeshData = function (simpleMesh, normalLighting) {
    var vertices = simpleMesh.vertices;
    var triangles = simpleMesh.triangles;
    var totIdxs = [];
    var totPos = [];
    var totNorm = [];
    var totCol = [];
    var trianglesSize = triangles.size();
    for (var i = 0; i < trianglesSize; i++) {
        var triangle = triangles.get(i);
        var idxs = triangle.point_id;
        totIdxs.push.apply(totIdxs, [idxs[0], idxs[1], idxs[0], idxs[2], idxs[1], idxs[2]]);
    }
    triangles["delete"]();
    var verticesSize = vertices.size();
    for (var i = 0; i < verticesSize; i++) {
        var vert = vertices.get(i);
        totPos.push.apply(totPos, vert.pos);
        totNorm.push.apply(totNorm, vert.normal);
        totCol.push.apply(totCol, vert.color);
        vert["delete"]();
    }
    vertices["delete"]();
    simpleMesh["delete"]();
    if (normalLighting)
        return { prim_types: [["NORMALLINES"]], useIndices: [[true]], idx_tri: [[totIdxs]], vert_tri: [[totPos]], additional_norm_tri: [[totNorm]], norm_tri: [[totNorm]], col_tri: [[totCol]] };
    else
        return { prim_types: [["LINES"]], useIndices: [[true]], idx_tri: [[totIdxs]], vert_tri: [[totPos]], norm_tri: [[totNorm]], col_tri: [[totCol]] };
};
var read_pdb = function (coordData, name) {
    var theGuid = guid();
    var theSuffix;
    if (coordData.startsWith("data_")) {
        theSuffix = "mmcif";
    }
    else {
        theSuffix = "pdb";
    }
    cootModule.FS_createDataFile(".", "".concat(theGuid, ".").concat(theSuffix), coordData, true, true);
    var tempFilename = "./".concat(theGuid, ".").concat(theSuffix);
    var molNo = molecules_container.read_pdb(tempFilename);
    cootModule.FS_unlink(tempFilename);
    return molNo;
};
var auto_open_mtz = function (mtzData) {
    var theGuid = guid();
    var asUint8Array = new Uint8Array(mtzData);
    cootModule.FS_createDataFile(".", "".concat(theGuid, ".mtz"), asUint8Array, true, true);
    var tempFilename = "./".concat(theGuid, ".mtz");
    var result = molecules_container.auto_read_mtz(tempFilename);
    cootModule.FS_unlink(tempFilename);
    return result;
};
var read_dictionary = function (coordData, associatedMolNo) {
    var theGuid = guid();
    cootModule.FS_createDataFile(".", "".concat(theGuid, ".cif"), coordData, true, true);
    var tempFilename = "./".concat(theGuid, ".cif");
    var returnVal = molecules_container.import_cif_dictionary(tempFilename, associatedMolNo);
    cootModule.FS_unlink(tempFilename);
    return returnVal;
};
var replace_molecule_by_model_from_file = function (imol, coordData) {
    var theGuid = guid();
    var tempFilename = "./".concat(theGuid, ".pdb");
    cootModule.FS_createDataFile(".", tempFilename, coordData, true, true);
    var result = molecules_container.replace_molecule_by_model_from_file(imol, tempFilename);
    cootModule.FS_unlink(tempFilename);
    return result;
};
var replace_map_by_mtz_from_file = function (imol, mtzData, selectedColumns) {
    var theGuid = guid();
    var tempFilename = "./".concat(theGuid, ".mtz");
    var asUint8Array = new Uint8Array(mtzData);
    cootModule.FS_createDataFile(".", tempFilename, asUint8Array, true, true);
    var readMtzArgs = [imol, tempFilename, selectedColumns.F, selectedColumns.PHI, "", false];
    var result = molecules_container.replace_map_by_mtz_from_file.apply(molecules_container, readMtzArgs);
    cootModule.FS_unlink(tempFilename);
    return result;
};
var new_positions_for_residue_atoms = function (molToUpDate, residues) {
    var success = 0;
    var movedResidueVector = new cootModule.Vectormoved_residue_t();
    residues.forEach(function (atoms) {
        if (atoms.length > 0) {
            var cidFields = atoms[0].label.split('/');
            var _a = cidFields[3].split("."), resNoStr = _a[0], insCode = _a[1];
            insCode = insCode ? insCode : "";
            var movedResidue_1 = new cootModule.moved_residue_t(cidFields[2], parseInt(resNoStr), insCode);
            atoms.forEach(function (atom) {
                var movedAtom = new cootModule.moved_atom_t(atom.name, atom.alt_loc, atom.x, atom.y, atom.z, -1);
                movedResidue_1.add_atom(movedAtom);
                movedAtom["delete"]();
            });
            movedResidueVector.push_back(movedResidue_1);
            movedResidue_1["delete"]();
        }
    });
    var thisSuccess = molecules_container.new_positions_for_atoms_in_residues(molToUpDate, movedResidueVector);
    success += thisSuccess;
    movedResidueVector["delete"]();
    return success;
};
var read_mtz = function (mapData, name, selectedColumns) {
    var theGuid = guid();
    var asUint8Array = new Uint8Array(mapData);
    cootModule.FS_createDataFile(".", "".concat(theGuid, ".mtz"), asUint8Array, true, true);
    var tempFilename = "./".concat(theGuid, ".mtz");
    var read_mtz_args = [tempFilename, selectedColumns.F,
        selectedColumns.PHI, "", false, selectedColumns.isDifference];
    var molNo = molecules_container.read_mtz.apply(molecules_container, read_mtz_args);
    cootModule.FS_unlink(tempFilename);
    return molNo;
};
var associate_data_mtz_file_with_map = function (iMol, mtzData, F, SIGF, FREE) {
    var asUint8Array = new Uint8Array(mtzData.data);
    cootModule.FS_createDataFile(".", "".concat(mtzData.fileName, ".mtz"), asUint8Array, true, true);
    var mtzFilename = "./".concat(mtzData.fileName, ".mtz");
    var args = [iMol, mtzFilename, F, SIGF, FREE];
    molecules_container.associate_data_mtz_file_with_map.apply(molecules_container, args);
    return mtzFilename;
};
var read_ccp4_map = function (mapData, name, isDiffMap) {
    var theGuid = guid();
    var asUint8Array = new Uint8Array(mapData);
    cootModule.FS_createDataFile(".", "".concat(theGuid, ".map"), asUint8Array, true, true);
    var tempFilename = "./".concat(theGuid, ".map");
    var read_map_args = [tempFilename, isDiffMap];
    var molNo = molecules_container.read_ccp4_map.apply(molecules_container, read_map_args);
    cootModule.FS_unlink(tempFilename);
    return molNo;
};
var setUserDefinedBondColours = function (imol, colours) {
    var colourMap = new cootModule.MapIntFloat3();
    var indexedResiduesVec = new cootModule.VectorStringUInt_pair();
    colours.forEach(function (colour, index) {
        colourMap.set(index + 51, colour.rgb);
        var i = { first: colour.cid, second: index + 51 };
        indexedResiduesVec.push_back(i);
    });
    molecules_container.set_user_defined_bond_colours(imol, colourMap);
    molecules_container.set_user_defined_atom_colour_by_selection(imol, indexedResiduesVec, false);
    indexedResiduesVec["delete"]();
    colourMap["delete"]();
};
var doColourTest = function (imol) {
    console.log('DEBUG: Start test...');
    var colourMap = new cootModule.MapIntFloat3();
    colourMap[20] = [1., 0., 0.];
    colourMap[21] = [0., 1., 0.];
    colourMap[22] = [0., 0., 1.];
    var indexedResiduesVec = new cootModule.VectorStringUInt_pair();
    var a = { first: '//A/1-10/', second: 20 };
    indexedResiduesVec.push_back(a);
    var b = { first: '//A/11-20/', second: 21 };
    indexedResiduesVec.push_back(b);
    var c = { first: '//A/21-30/', second: 22 };
    indexedResiduesVec.push_back(c);
    console.log('DEBUG: Running molecules_container.set_user_defined_bond_colours');
    molecules_container.set_user_defined_bond_colours(imol, colourMap);
    console.log('DEBUG: Running molecules_container.set_user_defined_atom_colour_by_selection');
    molecules_container.set_user_defined_atom_colour_by_selection(imol, indexedResiduesVec, false);
    indexedResiduesVec["delete"]();
    colourMap["delete"]();
};
var doCootCommand = function (messageData) {
    var returnType = messageData.returnType, command = messageData.command, commandArgs = messageData.commandArgs, messageId = messageData.messageId, myTimeStamp = messageData.myTimeStamp, message = messageData.message;
    try {
        var cootResult = void 0;
        switch (command) {
            case 'shim_read_pdb':
                cootResult = read_pdb.apply(void 0, commandArgs);
                break;
            case 'shim_new_positions_for_residue_atoms':
                cootResult = new_positions_for_residue_atoms.apply(void 0, commandArgs);
                break;
            case 'shim_read_mtz':
                cootResult = read_mtz.apply(void 0, commandArgs);
                break;
            case 'shim_auto_open_mtz':
                cootResult = auto_open_mtz.apply(void 0, commandArgs);
                break;
            case 'shim_read_ccp4_map':
                cootResult = read_ccp4_map.apply(void 0, commandArgs);
                break;
            case 'shim_read_dictionary':
                cootResult = read_dictionary.apply(void 0, commandArgs);
                break;
            case 'shim_associate_data_mtz_file_with_map':
                cootResult = associate_data_mtz_file_with_map.apply(void 0, commandArgs);
                break;
            case 'shim_replace_molecule_by_model_from_file':
                cootResult = replace_molecule_by_model_from_file.apply(void 0, commandArgs);
                break;
            case 'shim_replace_map_by_mtz_from_file':
                cootResult = replace_map_by_mtz_from_file.apply(void 0, commandArgs);
                break;
            case 'shim_do_colour_test':
                cootResult = doColourTest.apply(void 0, commandArgs);
                break;
            case 'shim_set_bond_colours':
                cootResult = setUserDefinedBondColours.apply(void 0, commandArgs);
                break;
            case 'shim_smiles_to_pdb':
                cootResult = cootModule.SmilesToPDB.apply(cootModule, commandArgs);
                break;
            default:
                cootResult = molecules_container[command].apply(molecules_container, commandArgs);
                break;
        }
        var returnResult = void 0;
        switch (returnType) {
            case 'instanced_mesh_perm':
                returnResult = instancedMeshToMeshData(cootResult, true);
                break;
            case 'symmetry':
                returnResult = symmetryToJSData(cootResult);
                break;
            case 'mmrrcc_stats':
                returnResult = mmrrccStatsToJSArray(cootResult);
                break;
            case 'colour_rules':
                returnResult = colourRulesToJSArray(cootResult);
                break;
            case 'instanced_mesh_perfect_spheres':
                returnResult = instancedMeshToMeshData(cootResult, false, true);
                break;
            case 'instanced_mesh':
                returnResult = instancedMeshToMeshData(cootResult, false, false, 5);
                break;
            case 'mesh_perm':
                returnResult = simpleMeshToMeshData(cootResult, true);
                break;
            case 'mesh':
                returnResult = simpleMeshToMeshData(cootResult);
                break;
            case 'lit_lines_mesh':
                returnResult = simpleMeshToLineMeshData(cootResult, true);
                break;
            case 'lines_mesh':
                returnResult = simpleMeshToLineMeshData(cootResult, false);
                break;
            case 'float_array':
                returnResult = floatArrayToJSArray(cootResult);
                break;
            case 'int_array':
                returnResult = intArrayToJSArray(cootResult);
                break;
            case 'map_molecule_centre_info_t':
                returnResult = mapMoleculeCentreInfoToJSObject(cootResult);
                break;
            case 'string_array':
                returnResult = stringArrayToJSArray(cootResult);
                break;
            case 'residue_specs':
                returnResult = residueSpecToJSArray(cootResult);
                break;
            case 'ramachandran_data':
                returnResult = ramachandranDataToJSArray(cootResult, messageData.chainID);
                break;
            case 'validation_data':
                returnResult = validationDataToJSArray(cootResult, messageData.chainID);
                break;
            case 'interesting_places_data':
                returnResult = interestingPlaceDataToJSArray(cootResult);
                break;
            case 'superpose_results':
                returnResult = SuperposeResultsToJSArray(cootResult);
                break;
            case 'generic_3d_lines_bonds_box':
                returnResult = linesBoxToJSArray(cootResult);
                break;
            case 'vector_hbond':
                returnResult = vectorHBondToJSArray(cootResult);
                break;
            case 'status_instanced_mesh_pair':
                returnResult = { status: cootResult.first, mesh: instancedMeshToMeshData(cootResult.second, false, false, 5) };
                break;
            case 'status':
            default:
                returnResult = cootResult;
                break;
        }
        return {
            messageId: messageId,
            messageSendTime: Date.now(),
            consoleMessage: "Completed ".concat(command, " in ").concat(Date.now() - myTimeStamp, " ms"),
            result: { status: 'Completed', result: returnResult }
        };
    }
    catch (err) {
        console.log(err);
        return {
            messageId: messageId,
            myTimeStamp: myTimeStamp,
            message: message,
            consoleMessage: "EXCEPTION RAISED IN ".concat(command, ", ").concat(err),
            result: { status: 'Exception' }
        };
    }
};
onmessage = function (e) {
    if (e.data.message === 'CootInitialize') {
        createRSRModule({
            locateFile: function (file) { return "./wasm/".concat(file); },
            onRuntimeInitialized: function () { },
            mainScriptUrlOrBlob: "moorhen.js",
            print: print,
            printErr: print
        })
            .then(function (returnedModule) {
            postMessage({ consoleMessage: 'Initialized molecules_container', message: e.data.message, messageId: e.data.messageId });
            cootModule = returnedModule;
            molecules_container = new cootModule.molecules_container_js(false);
            molecules_container.set_show_timings(false);
            molecules_container.fill_rotamer_probability_tables();
            molecules_container.set_map_sampling_rate(1.7);
            cootModule.FS.mkdir("COOT_BACKUP");
        })["catch"](function (e) {
            console.log(e);
            print(e);
        });
        createCCP4Module({
            locateFile: function (file) { return "./wasm/".concat(file); },
            onRuntimeInitialized: function () { },
            mainScriptUrlOrBlob: "web_example.js",
            print: print,
            printErr: print
        })
            .then(function (returnedModule) {
            ccp4Module = returnedModule;
        })["catch"](function (e) {
            console.log(e);
            print(e);
        });
    }
    else if (e.data.message === 'get_atoms') {
        var theGuid = guid();
        var tempFilename = "./".concat(theGuid, ".pdb");
        if (e.data.format === 'pdb') {
            molecules_container.writePDBASCII(e.data.molNo, tempFilename);
        }
        else if (e.data.format === 'mmcif') {
            molecules_container.writeCIFASCII(e.data.molNo, tempFilename);
        }
        else {
            console.log("Unrecognised format... ".concat(e.data.format));
        }
        var pdbData = cootModule.FS.readFile(tempFilename, { encoding: 'utf8' });
        cootModule.FS_unlink(tempFilename);
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            consoleMessage: "Fetched coordinates of molecule ".concat(e.data.molNo),
            message: e.data.message,
            result: { molNo: e.data.molNo, pdbData: pdbData }
        });
    }
    else if (e.data.message === 'get_mtz_data') {
        var mtzData = cootModule.FS.readFile(e.data.fileName, { encoding: 'binary' });
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            consoleMessage: "Fetched mtz data for map ".concat(e.data.molNo),
            message: e.data.message,
            result: { molNo: e.data.molNo, mtzData: mtzData }
        });
    }
    else if (e.data.message === 'get_map') {
        var theGuid = guid();
        var tempFilename = "./".concat(theGuid, ".map");
        molecules_container.writeCCP4Map(e.data.molNo, tempFilename);
        var mapData = cootModule.FS.readFile(tempFilename, { encoding: 'binary' });
        cootModule.FS_unlink(tempFilename);
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            consoleMessage: "Fetched map of map ".concat(e.data.molNo),
            message: e.data.message,
            result: { molNo: e.data.molNo, mapData: mapData.buffer }
        });
    }
    else if (e.data.message === 'read_mtz') {
        try {
            var theGuid = guid();
            cootModule.FS_createDataFile(".", "".concat(theGuid, ".mtz"), e.data.data, true, true, true);
            var tempFilename = "./".concat(theGuid, ".mtz");
            var molNo = molecules_container.read_mtz(tempFilename, 'FWT', 'PHWT', "", false, false);
            cootModule.FS_unlink(tempFilename);
            postMessage({
                messageId: e.data.messageId,
                myTimeStamp: e.data.myTimeStamp,
                consoleMessage: "Read map MTZ as molecule ".concat(molNo),
                message: e.data.message,
                result: { molNo: molNo, name: e.data.name }
            });
        }
        catch (err) {
            print(err);
        }
    }
    else if (e.data.message === 'get_rama') {
        var theGuid = guid();
        var tempFilename = "./".concat(theGuid, ".pdb");
        molecules_container.writePDBASCII(e.data.molNo, tempFilename);
        var result = cootModule.getRamachandranData(tempFilename, e.data.chainId);
        cootModule.FS_unlink(tempFilename);
        var resInfo = [];
        for (var ir = 0; ir < result.size(); ir++) {
            var cppres = result.get(ir);
            //TODO - Is there a nicer way to do this?
            var jsres = { chainId: cppres.chainId, insCode: cppres.insCode, seqNum: cppres.seqNum, restype: cppres.restype, phi: cppres.phi, psi: cppres.psi, isOutlier: cppres.isOutlier, is_pre_pro: cppres.is_pre_pro };
            resInfo.push(jsres);
        }
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            messageTag: "result",
            result: resInfo
        });
    }
    else if (e.data.message === 'copy_fragment') {
        var newmolNo = molecules_container.copy_fragment_using_residue_range(e.data.molNo, e.data.chainId, e.data.res_no_start, e.data.res_no_end);
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            messageTag: "result",
            result: newmolNo
        });
    }
    else if (e.data.message === 'delete') {
        var result = molecules_container.close_molecule(e.data.molNo);
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            messageTag: "result",
            result: result
        });
    }
    else if (e.data.message === 'delete_file_name') {
        var result = cootModule.FS_unlink(e.data.fileName);
        postMessage({
            messageId: e.data.messageId,
            myTimeStamp: e.data.myTimeStamp,
            messageTag: "result",
            result: result
        });
    }
    else if (e.data.message === 'coot_command_list') {
        var resultList = e.data.commandList.map(function (command) { return doCootCommand(__assign(__assign({}, e.data), command)); });
        postMessage({
            messageId: e.data.messageId,
            resultList: resultList
        });
    }
    if (e.data.message === 'coot_command') {
        var result = doCootCommand(e.data);
        postMessage(result);
    }
};

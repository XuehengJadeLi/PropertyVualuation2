import * as Cesium from 'cesium';

export function addGLTF({
    viewer,
    id,
    url,
    position,
    show = true,
    rotationz = 0,
    scale = 1,
    allowPick = true,
    blendMode = "MIX",
    color,
    cs
}) {
    if (!viewer) throw new Error('Viewer is required');
    if (!id) throw new Error('ID is required');
    if (!url) throw new Error('URL is required');
    if (!position || !Array.isArray(position) || position.length !== 3) {
        throw new Error('Position must be an array [longitude, latitude, height]');
    }

    const [longitude, latitude, height] = position;

    // Create the entity
    const entity = viewer.entities.add({
        id: id,
        name: id,
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude, height),
        orientation: Cesium.Quaternion.fromAxisAngle(
            Cesium.Cartesian3.UNIT_Z,
            Cesium.Math.toRadians(rotationz)
        ),
        show: show,
        model: {
            uri: url,
            scale: scale,
            color: color,
            colorBlendMode: Cesium[blendMode],
            colorBlendAmount: 0.5,
            customShader: cs,
            allowPicking: allowPick
        }
    });

    return entity;
}
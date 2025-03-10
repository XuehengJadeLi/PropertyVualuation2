export class BuildingMaterial {
    constructor(color) {
        this.uniforms = {
            color: color
        };
        
        this.fragmentShader = `
            void fragmentMain(FragmentInput fsInput, inout FragmentOutput fsOutput) {
                material.diffuse = color;
                material.alpha = 0.5;
            }
        `;
    }
}
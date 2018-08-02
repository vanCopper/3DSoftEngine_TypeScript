/**
 * @author vanCopper
 *
 */
var core;
(function (core) {
    var Mesh = /** @class */ (function () {
        function Mesh(name, verticesCount) {
            this.position = utils.Vector3.Zero();
            this.rotation = utils.Vector3.Zero();
            this.vertices = new Array(verticesCount);
            this.name = name;
        }
        return Mesh;
    }());
    core.Mesh = Mesh;
})(core || (core = {}));
//# sourceMappingURL=Mesh.js.map
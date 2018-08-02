/**
 * @author vanCopper
 *
 */
var core;
(function (core) {
    var Camera = /** @class */ (function () {
        function Camera() {
            this.position = utils.Vector3.Zero();
            this.target = utils.Vector3.Zero();
        }
        return Camera;
    }());
    core.Camera = Camera;
})(core || (core = {}));
//# sourceMappingURL=Camera.js.map
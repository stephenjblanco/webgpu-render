import shader from './shaders/shaders.wgsl';
import { Mesh } from './mesh';
import { mat4 } from 'gl-matrix';

export class Renderer {
    // device / context
    private device: GPUDevice;
    private context: GPUCanvasContext;

    // pipeline objects
    private uniformBuffer: GPUBuffer;
    private bindGroup: GPUBindGroup;
    private pipeline: GPURenderPipeline;

    // assets
    private mesh: Mesh;

    // used to rotate thing
    t: number = 0.0;

    private constructor(
        device: GPUDevice,
        context: GPUCanvasContext,
        uniformBuffer: GPUBuffer,
        bindGroup: GPUBindGroup,
        pipeline: GPURenderPipeline,
        mesh: Mesh,
    ) {
        this.device = device;
        this.context = context;
        this.uniformBuffer = uniformBuffer;
        this.bindGroup = bindGroup;
        this.pipeline = pipeline;
        this.mesh = mesh;
        this.t = 0.0;
    }

    render = () => {
        this.t += 0.01;

        if (this.t > 2.0 * Math.PI) {
            this.t -= 2.0 * Math.PI;
        }

        // load perspective projection into projection matrix
        const projection = mat4.create();
        mat4.perspective(projection, Math.PI / 4, 800 / 600, 0.1, 10);

        // load lookAt matrix into view matrix
        const view = mat4.create();
        mat4.lookAt(view, [-2, 0, 2], [0, 0, 0], [0, 0, 1]);

        // rotate model matrix t radians around z-axis
        const model = mat4.create();
        mat4.rotate(model, model, this.t, [0, 0, 1]);

        this.device!.queue.writeBuffer(this.uniformBuffer!, 0, <ArrayBuffer>model);
        this.device!.queue.writeBuffer(this.uniformBuffer!, 64, <ArrayBuffer>view);
        this.device!.queue.writeBuffer(this.uniformBuffer!, 128, <ArrayBuffer>projection);

        // command encoder: records draw cmds for submission
        const commandEncoder: GPUCommandEncoder = this.device!.createCommandEncoder();
        // texture view: image view to the color buffer
        const textureView: GPUTextureView = this.context!.getCurrentTexture().createView();
        // renderpass: holds draw commands, allocated from command encoder
        const renderPass: GPURenderPassEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.5, g: 0.0, b: 0.25, a: 1.0 },
                    loadOp: 'clear',
                    storeOp: 'store',
                },
            ],
        });

        renderPass.setPipeline(this.pipeline!);
        renderPass.setVertexBuffer(0, this.mesh!.buffer);
        renderPass.setBindGroup(0, this.bindGroup);
        renderPass.draw(3, 1, 0, 0);
        renderPass.end();

        this.device!.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(this.render);
    };

    static async create(canvas: HTMLCanvasElement): Promise<Renderer> {
        const initializer = new Renderer.Initializer(canvas);

        await initializer.setupDevice();
        initializer.initAssets();
        await initializer.makePipeline();

        return new Renderer(
            initializer.device!,
            initializer.context!,
            initializer.uniformBuffer!,
            initializer.bindGroup!,
            initializer.pipeline!,
            initializer.mesh!,
        );
    }

    private static Initializer = class {
        canvas: HTMLCanvasElement;

        // device / context
        adapter?: GPUAdapter;
        format?: GPUTextureFormat;
        device?: GPUDevice;
        context?: GPUCanvasContext;

        // pipeline objects
        uniformBuffer?: GPUBuffer;
        bindGroup?: GPUBindGroup;
        pipeline?: GPURenderPipeline;

        // assets
        mesh?: Mesh;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
        }

        async setupDevice() {
            // adapter: wrapper around GPU, describes features + limits
            this.adapter = <GPUAdapter>await navigator.gpu?.requestAdapter();
            // device: wrapper around GPU functionality
            this.device = <GPUDevice>await this.adapter!.requestDevice();
            // context: WGPU context
            this.context = <GPUCanvasContext>this.canvas.getContext('webgpu');
            // format: pixel format, four 8-bit unsigned ints in BGRA order
            this.format = 'bgra8unorm';

            this.context.configure({
                device: this.device,
                format: this.format,
                alphaMode: 'opaque',
            });
        }

        initAssets() {
            this.mesh = new Mesh(this.device!);
        }

        async makePipeline() {
            this.uniformBuffer = this.device!.createBuffer({
                size: 64 * 3,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const bindGroupLayout = this.device!.createBindGroupLayout({
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {},
                    },
                ],
            });

            this.bindGroup = this.device!.createBindGroup({
                layout: bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: { buffer: this.uniformBuffer! },
                    },
                ],
            });

            const pipelineLayout = this.device!.createPipelineLayout({
                bindGroupLayouts: [bindGroupLayout],
            });

            this.pipeline = this.device!.createRenderPipeline({
                vertex: {
                    module: this.device!.createShaderModule({ code: shader }),
                    entryPoint: 'vs_main',
                    buffers: [this.mesh!.bufferLayout],
                },
                fragment: {
                    module: this.device!.createShaderModule({ code: shader }),
                    entryPoint: 'fs_main',
                    targets: [{ format: this.format! }],
                },
                primitive: { topology: 'triangle-list' },
                layout: pipelineLayout,
            });
        }
    };
}

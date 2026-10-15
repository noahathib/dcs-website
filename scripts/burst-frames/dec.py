import subprocess, numpy as np, imageio_ffmpeg
FF = imageio_ffmpeg.get_ffmpeg_exe(); W,H=1920,1080
def yuv_frames(path, idxs=None):
    """Yield (n, rgb_float) decoding raw yuv420p with exact BT.709 limited-range float math (bilinear chroma upsample)."""
    vf = "format=yuv420p" if idxs is None else "select='" + "+".join(f"eq(n\\,{i})" for i in idxs) + "',format=yuv420p"
    p=subprocess.Popen([FF,'-v','error','-i',path,'-vf',vf,'-vsync','0','-f','rawvideo','-'],stdout=subprocess.PIPE)
    fs=W*H*3//2; n=0
    while True:
        raw=p.stdout.read(fs)
        if len(raw)<fs: break
        y=np.frombuffer(raw[:W*H],np.uint8).reshape(H,W).astype(np.float32)
        u=np.frombuffer(raw[W*H:W*H+W*H//4],np.uint8).reshape(H//2,W//2).astype(np.float32)
        v=np.frombuffer(raw[W*H+W*H//4:],np.uint8).reshape(H//2,W//2).astype(np.float32)
        # chroma upsample: center-left sited (mpeg2/h264 default). simple: repeat then 3-tap smooth horizontally+vertically
        def up(c):
            c2=np.repeat(np.repeat(c,2,0),2,1)
            k=np.pad(c2,1,mode='edge')
            return (k[1:-1,1:-1]*0.5+0.125*(k[:-2,1:-1]+k[2:,1:-1]+k[1:-1,:-2]+k[1:-1,2:]))
        U=up(u); V=up(v)
        kr,kb=0.2126,0.0722; kg=1-kr-kb
        yy=(y-16)/219; cb=(U-128)/224; cr=(V-128)/224
        r=yy+2*(1-kr)*cr; b=yy+2*(1-kb)*cb; g=(yy-kr*r-kb*b)/kg
        yield (idxs[n] if idxs else n), np.stack([r,g,b],-1)*255.0
        n+=1
    p.wait()

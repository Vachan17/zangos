import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows, useProgress } from "@react-three/drei";
import * as THREE from "three";

/** Paths from `public/` — must honor Vite base (e.g. /zangos/ on GitHub Pages). */
const pub = (name) => `${import.meta.env.BASE_URL}${name.replace(/^\//, "")}`;

function lerp(a,b,t){return a+(b-a)*Math.max(0,Math.min(1,t));}
function easeOut(t){return 1-Math.pow(1-Math.max(0,Math.min(1,t)),3);}
function easeInOut(t){t=Math.max(0,Math.min(1,t));return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}

function LoaderScreen({onReady}){
  const {progress,active}=useProgress();
  useEffect(()=>{if(!active&&progress>=100)setTimeout(onReady,600);},[active,progress]);
  useEffect(()=>{const t=setTimeout(()=>onReady(),15000);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:"absolute",inset:0,zIndex:20,background:"#000000",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <video src={pub("zangoslogo.mp4")} autoPlay loop muted playsInline style={{width:"400px",maxWidth:"80vw",height:"auto",marginBottom:"2.5rem"}}/>
      <div style={{width:260,height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#D0161B,#F97316)",width:`${progress}%`,transition:"width 0.4s ease"}}/>
      </div>
      <div style={{marginTop:"1.2rem",fontFamily:"'Barlow',sans-serif",fontSize:"0.85rem",color:"rgba(255,255,255,0.6)",letterSpacing:"0.25em"}}>LOADING {Math.round(progress)}%</div>
    </div>
  );
}

function CameraRig({sp,mouseRef}){
  const {camera}=useThree();
  useFrame(()=>{
    if(sp<0.05){
      camera.position.x+=(mouseRef.current[0]*0.4-camera.position.x)*0.04;
      camera.position.y+=(-mouseRef.current[1]*0.2+1.0-camera.position.y)*0.04;
    }else{
      camera.position.x+=(0-camera.position.x)*0.05;
      camera.position.y+=(1.0-camera.position.y)*0.05;
    }
    camera.position.z+=(12-camera.position.z)*0.04;
    camera.lookAt(0,0,0);
  });
  return null;
}

// Normalize model: scale to targetSize, bottom sits at y=0, centered on x/z
function useModel(url, targetSize, removeNodes=[]){
  const {scene}=useGLTF(url);
  const cache=useRef({}); // Keyed by URL
  
  if(!cache.current[url]){
    const clone=scene.clone(true);
    if(removeNodes.length>0){
      const toRemove=[];
      clone.traverse(c=>{
        if(removeNodes.some(n=>c.name.includes(n))) toRemove.push(c);
      });
      toRemove.forEach(c=>c.removeFromParent());
    }
    const box=new THREE.Box3().setFromObject(clone);
    const sz=box.getSize(new THREE.Vector3());
    const ctr=box.getCenter(new THREE.Vector3());
    const sc=targetSize/Math.max(sz.x,sz.y,sz.z,0.001);
    // center x/z, lift so bottom is at y=0
    clone.position.set(-ctr.x*sc, -box.min.y*sc, -ctr.z*sc);
    cache.current[url]={clone,sc};
  }
  return cache.current[url];
}

// ── PLATE — slides in from left, sits at y=-2 ─────────────────────────────────
function Plate({sp}){
  const {clone,sc}=useModel(pub("plate.glb"),6.5);
  const g=useRef();
  useFrame(()=>{
    if(!g.current)return;
    const a=easeOut(Math.min(1, sp/0.15));
    const e=easeInOut(Math.max(0,(sp-0.80)/0.20));
    g.current.position.set(lerp(0,-20,e), lerp(-10,-2.8,a), 1.0);
  });
  return <group ref={g}><primitive object={clone} scale={sc}/></group>;
}

// ── DYNAMIC CHICKEN SEQUENCE — falls first, then swaps models ──────────────────
function DynamicChicken({sp}){
  const models = [
    { url: pub("chicken.glb"), size: 3.6 },
    { url: pub("chicken_wing_2.glb"), size: 2.8 },
    { url: pub("chicken_nugget.glb"), size: 2.5, tint: "#4B2C20" },
    { url: pub("fried_chicken_lowpoly.glb"), size: 3.0 }
  ];

  // Landing animation happens between sp 0.05 and 0.20
  const fallProgress = easeOut(Math.min(1, Math.max(0,(sp-0.05)/0.15)));
  
  // Model swap sequence: every 0.12 scroll progress starting at 0.22
  const sequenceStart = 0.22;
  const interval = 0.12;
  const modelIndex = sp < sequenceStart ? 0 : Math.min(models.length - 1, Math.floor((sp - sequenceStart) / interval) + 1);
  
  const currentModel = useModel(models[modelIndex].url, models[modelIndex].size);
  const g = useRef();

  useEffect(() => {
    if (currentModel && models[modelIndex].tint) {
      currentModel.clone.traverse(c => {
        if (c.isMesh) {
          c.material.color.set(models[modelIndex].tint);
          // Also darken it a bit for that "blackish" look
          c.material.roughness = 0.8;
          c.material.metalness = 0.2;
        }
      });
    }
  }, [currentModel, modelIndex]);

  useFrame(() => {
    if(!g.current) return;
    const e = easeInOut(Math.max(0,(sp-0.80)/0.20));
    
    // Position: Falling -> Landed on Plate -> Exit
    const yPos = sp < 0.20 ? lerp(10, -2.2, fallProgress) : -2.2;
    g.current.position.set(lerp(0, -20, e), yPos, 1.3);
    
    // Gentle rotation
    g.current.rotation.x = Math.PI / 2 - 0.2;
    // g.current.rotation.y += 0.015; // Stopped rotation as requested

    // Quick scale effect on swap
    const progressInInterval = ((sp - sequenceStart) % interval) / interval;
    const scalePulse = sp > sequenceStart && progressInInterval < 0.2 
      ? 1.0 + Math.sin(progressInInterval * Math.PI * 5) * 0.1 
      : 1.0;
    g.current.scale.set(scalePulse, scalePulse, scalePulse);
  });

  return (
    <group ref={g}>
      {currentModel && <primitive object={currentModel.clone} scale={currentModel.sc} />}
    </group>
  );
}

// ── COLA — very big, enters from bottom-left, lands LEFT of scene ──────
function Cola({sp}){
  const {clone,sc}=useModel(pub("cola.glb"), 14.0, ["Cube"]);
  clone.traverse((child) => {
    if (child.name.includes("Plane") || child.name.includes("Circle")) {
      child.visible = true;
    }
  });
  const g=useRef();
  useFrame(()=>{
    if(!g.current)return;
    const a=easeOut(Math.min(1, Math.max(0,(sp-0.10)/0.15)));
    const e=easeInOut(Math.max(0,(sp-0.80)/0.20));
    g.current.position.set(lerp(-20, -10, a) + lerp(0,-20,e), lerp(-12, -6.5, a), -4.0);
    g.current.rotation.z=lerp(Math.PI/4, -0.3, a);
  });
  return <group ref={g}><primitive object={clone} scale={sc}/></group>;
}

// ── BURGER — big, RIGHT side, falls from top ──────────────────────────────────
function Burger({sp}){
  const {clone,sc}=useModel(pub("burger.glb"), 8.0);
  const g=useRef();
  useFrame(()=>{
    if(!g.current)return;
    const a=easeOut(Math.min(1, Math.max(0,(sp-0.15)/0.15)));
    const e=easeInOut(Math.max(0,(sp-0.80)/0.20));
    g.current.position.set(lerp(20, 8, a)+lerp(0,20,e), lerp(10,-2.5,a), 1.5);
    g.current.rotation.y=lerp(Math.PI, -0.4, a);
    g.current.rotation.z=lerp(0, 0.1, a);
  });
  return <group ref={g}><primitive object={clone} scale={sc}/></group>;
}



// ── MAYO — near the chicken/plate ──────────────────────────────────────
function Mayo({sp}){
  const {clone,sc}=useModel(pub("mayo.glb"), 1.2);
  const g=useRef();
  useFrame(()=>{
    if(!g.current)return;
    const a=easeOut(Math.min(1, Math.max(0,(sp-0.12)/0.15)));
    const e=easeInOut(Math.max(0,(sp-0.80)/0.20));
    g.current.position.set(lerp(-10, -2.5, a)+lerp(0,-20,e), lerp(10,-2.4,a), 2.0);
  });
  return <group ref={g}><primitive object={clone} scale={sc}/></group>;
}

function Sparks({sp}){
  const ref=useRef();
  const COUNT=80;
  const pos=useRef(new Float32Array(COUNT*3));
  const vel=useRef(Array.from({length:COUNT},()=>({x:(Math.random()-.5)*.09,y:Math.random()*.1+.02,z:(Math.random()-.5)*.09,life:Math.random()})));
  const active=sp>0.26&&sp<0.50;
  useFrame(()=>{
    if(!ref.current||!active)return;
    const p=pos.current;
    vel.current.forEach((v,i)=>{
      v.life+=0.03;
      if(v.life>1){v.life=0;p[i*3]=(Math.random()-.5)*.6;p[i*3+1]=-1.6;p[i*3+2]=(Math.random()-.5)*.6;}
      p[i*3]+=v.x;p[i*3+1]+=v.y;p[i*3+2]+=v.z;v.y-=0.003;
    });
    ref.current.geometry.attributes.position.needsUpdate=true;
  });
  if(!active)return null;
  return(
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" count={COUNT} array={pos.current} itemSize={3}/></bufferGeometry>
      <pointsMaterial size={0.07} color="#F97316" transparent opacity={0.9} sizeAttenuation/>
    </points>
  );
}

function Scene({sp,mouseRef}){
  return(
    <>
      <CameraRig sp={sp} mouseRef={mouseRef}/>
      <ambientLight intensity={0.8}/>
      <directionalLight position={[6,12,6]} intensity={2.5} castShadow color="#fff8f0"/>
      <directionalLight position={[-5,5,-5]} intensity={0.8} color="#ff7020"/>
      <pointLight position={[0,6,4]} intensity={2.5} color="#D0161B"/>
      <pointLight position={[0,8,0]} intensity={sp>0.3&&sp<0.75?6:0} color="#F97316"/>
      <Environment preset="city"/>
      <Plate sp={sp}/>
      <DynamicChicken sp={sp}/>
      <Mayo sp={sp}/>
      <Cola sp={sp}/>
      <Burger sp={sp}/>
      <ContactShadows position={[0,-2.2,0]} opacity={0.5} scale={28} blur={3.5} far={7} color="#200800"/>
    </>
  );
}

function HeroText({sp}){
  const op=Math.max(0,1-Math.max(0,sp-0.3)*5);
  if(op<=0)return null;
  return(
    <div style={{position:"absolute",top:"50%",left:"5%",transform:`translateY(calc(-50% + ${sp*-80}px))`,zIndex:10,maxWidth:400,opacity:op,pointerEvents:op<0.1?"none":"auto",mixBlendMode:"difference"}}>
      <div style={{display:"inline-block", border:"1px solid rgba(0,0,0,0.1)", background:"rgba(255,255,255,0.85)", color:"#000",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:"0.65rem",letterSpacing:"0.3em",textTransform:"uppercase",padding:"0.4rem 1.2rem",borderRadius:"2rem",marginBottom:"1.2rem",backdropFilter:"blur(8px)"}}>The Zangos Experience</div>
      <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(3.5rem,8vw,7rem)",lineHeight:0.95,letterSpacing:"0.02em",color:"#fff",marginBottom:"0.8rem"}}>
        ELEVATE YOUR<br/><span style={{color:"#2fe9e4"}}>CRAVING.</span>
      </h1>
      <p style={{fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:"1rem",color:"#eee",lineHeight:1.6,marginBottom:"2.2rem",maxWidth:"90%"}}>
        Experience the perfect balance of hand-crafted crispiness and our signature blend of spices.
        <br/><br/><span style={{color:"#444",fontSize:"0.75rem",textTransform:"uppercase",letterSpacing:"0.1em"}}>Scroll to discover</span>
      </p>
      <div style={{display:"flex",gap:"1rem",flexWrap:"wrap"}}>
        <button onClick={()=>document.getElementById("menu")?.scrollIntoView({behavior:"smooth"})} style={{background:"#fff",color:"#000",border:"none",fontFamily:"'Barlow',sans-serif",fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.12em",textTransform:"uppercase",padding:"1rem 2.2rem",borderRadius:"0.25rem",cursor:"pointer",boxShadow:"0 8px 25px rgba(255,255,255,0.2)",transition:"transform 0.2s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="translateY(-3px)"}
          onMouseLeave={e=>e.currentTarget.style.transform="none"}
        >Order Now</button>
        <button onClick={()=>document.getElementById("menu")?.scrollIntoView({behavior:"smooth"})} style={{background:"transparent",border:"2px solid #fff",color:"#fff",fontFamily:"'Barlow',sans-serif",fontWeight:800,fontSize:"0.85rem",letterSpacing:"0.12em",textTransform:"uppercase",padding:"1rem 2.2rem",borderRadius:"0.25rem",cursor:"pointer",transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.color="#000";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#fff";}}
        >View Menu</button>
      </div>
    </div>
  );
}

function StepDots({sp}){
  const steps=["Plate","Chicken","Sides","Menu"];
  const active=Math.min(3,Math.floor(sp*4));
  const op=Math.min(1,sp*15);
  return(
    <div style={{position:"absolute",right:"2rem",top:"50%",transform:"translateY(-50%)",zIndex:10,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"1rem",opacity:op}}>
      {steps.map((label,i)=>(
        <div key={label} style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
          <span style={{fontFamily:"'Barlow',sans-serif",fontSize:"0.6rem",fontWeight:800,letterSpacing:"0.1em",textTransform:"uppercase",color:i<=active?"rgba(249,115,22,0.9)":"rgba(0,0,0,0.3)",transition:"color 0.4s"}}>{label}</span>
          <div style={{width:i===active?24:7,height:7,borderRadius:4,background:i<active?"#D0161B":i===active?"#F97316":"rgba(0,0,0,0.15)",transition:"all 0.4s",boxShadow:i===active?"0 0 10px rgba(249,115,22,0.7)":"none"}}/>
        </div>
      ))}
    </div>
  );
}

export default function Hero3D(){
  const containerRef=useRef(null);
  const scrollRef=useRef(0);
  const smoothRef=useRef(0);
  const mouseRef=useRef([0,0]);
  const rafRef=useRef(null);
  const [sp,setSp]=useState(0);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    const onScroll=()=>{
      const el=containerRef.current;if(!el)return;
      const rect=el.getBoundingClientRect();
      const total=el.offsetHeight-window.innerHeight;
      scrollRef.current=Math.max(0,Math.min(1,-rect.top/total));
    };
    const onMouse=(e)=>{mouseRef.current=[(e.clientX/window.innerWidth-0.5)*2,(e.clientY/window.innerHeight-0.5)*2];};
    const tick=()=>{smoothRef.current+=(scrollRef.current-smoothRef.current)*0.07;setSp(smoothRef.current);rafRef.current=requestAnimationFrame(tick);};
    window.addEventListener("scroll",onScroll,{passive:true});
    window.addEventListener("mousemove",onMouse,{passive:true});
    rafRef.current=requestAnimationFrame(tick);
    return()=>{window.removeEventListener("scroll",onScroll);window.removeEventListener("mousemove",onMouse);cancelAnimationFrame(rafRef.current);};
  },[]);

  return(
    <div ref={containerRef} style={{height:"500vh",position:"relative"}}>
      <div style={{position:"sticky",top:0,width:"100%",height:"100vh",overflow:"hidden",background:"#ffffff"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"80vw",height:"80vh",background:"radial-gradient(ellipse,rgba(208,22,27,0.12) 0%,rgba(249,115,22,0.06) 40%,transparent 70%)",pointerEvents:"none",zIndex:1,opacity:(sp>0.3&&sp<0.75?2.5:1),transition:"opacity 0.5s"}}/>
        <div style={{position:"absolute",inset:0,opacity:0.2,backgroundImage:"radial-gradient(circle,rgba(249,115,22,0.35) 1px,transparent 1px)",backgroundSize:"36px 36px",pointerEvents:"none",zIndex:1}}/>
        <div style={{position:"absolute",top:0,left:0,right:0,height:`${Math.max(0,Math.min(15,(sp-0.03)*800))}vh`,background:"#000",zIndex:2}}/>
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:`${Math.max(0,Math.min(15,(sp-0.03)*800))}vh`,background:"#000",zIndex:2}}/>
        {loaded&&(
          <div style={{position:"absolute",inset:0,zIndex:5}}>
            <Canvas camera={{position:[0,1.0,12],fov:46}} gl={{antialias:true,alpha:true}} shadows>
              <Suspense fallback={null}><Scene sp={sp} mouseRef={mouseRef}/></Suspense>
            </Canvas>
          </div>
        )}
        {!loaded&&<LoaderScreen onReady={()=>setLoaded(true)}/>}
        <HeroText sp={sp}/>
        {sp<0.04&&(
          <div style={{position:"absolute",bottom:"2rem",left:"50%",transform:"translateX(-50%)",zIndex:21,display:"flex",flexDirection:"column",alignItems:"center",gap:"0.4rem"}}>
            <span style={{fontFamily:"'Barlow',sans-serif",fontSize:"0.62rem",letterSpacing:"0.2em",color:"rgba(249,115,22,0.9)",textTransform:"uppercase"}}>Scroll</span>
            <div style={{fontSize:"1.3rem",color:"rgba(249,115,22,0.9)",animation:"arrowBounce 1.5s ease-in-out infinite"}}>↓</div>
          </div>
        )}
        {sp>0.87&&(
          <div style={{position:"absolute",bottom:"14%",left:"50%",transform:"translateX(-50%)",zIndex:21,textAlign:"center",animation:"fadeUp 0.5s ease"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"clamp(1.8rem,4vw,2.8rem)",letterSpacing:"0.1em",color:"#fff",marginBottom:"1rem",textShadow:"0 0 40px rgba(208,22,27,0.5)"}}>READY TO ORDER? 🔥</div>
            <button onClick={()=>document.getElementById("menu")?.scrollIntoView({behavior:"smooth"})} style={{background:"#D0161B",color:"#fff",border:"none",fontFamily:"'Barlow',sans-serif",fontWeight:900,fontSize:"1rem",letterSpacing:"0.15em",textTransform:"uppercase",padding:"1rem 2.5rem",borderRadius:"0.25rem",cursor:"pointer",boxShadow:"0 8px 40px rgba(208,22,27,0.7)",animation:"ctaGlow 2s ease-in-out infinite"}}>See Our Menu →</button>
          </div>
        )}
        <style>{`
          @keyframes arrowBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(7px)}}
          @keyframes fadeUp{from{opacity:0;transform:translateX(-50%) translateY(20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
          @keyframes ctaGlow{0%,100%{box-shadow:0 8px 40px rgba(208,22,27,0.7)}50%{box-shadow:0 8px 60px rgba(208,22,27,1)}}
        `}</style>
      </div>
    </div>
  );
}

useGLTF.preload(pub("plate.glb"));
useGLTF.preload(pub("chicken.glb"));
useGLTF.preload(pub("chicken_wing_2.glb"));
useGLTF.preload(pub("chicken_nugget.glb"));
useGLTF.preload(pub("fried_chicken_lowpoly.glb"));
useGLTF.preload(pub("cola.glb"));
useGLTF.preload(pub("burger.glb"));
useGLTF.preload(pub("chilli.glb"));
useGLTF.preload(pub("mayo.glb"));
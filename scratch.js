import fs from 'fs';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// We need a DOM environment to run GLTFLoader typically, but maybe we can just read the file and find the names of the nodes.
// Actually, GLTF is just JSON at the end of the binary. 
// A simpler way: read the file as strings and grep for names.

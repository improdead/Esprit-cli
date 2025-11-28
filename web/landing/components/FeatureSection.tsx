import React from 'react';
import Button from './Button';
import Badge from './Badge';
import { useNavigate } from 'react-router-dom';

const FeatureSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        
        {/* Left Content */}
        <div className="flex-1 lg:sticky lg:top-24">
          <div className="mb-6">
             <span className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-black"></div>
                New feature on our product - <span className="text-orange-600 cursor-pointer">Read More</span>
             </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
            Your AI engineer follows you everywhere.
          </h2>

          <p className="font-mono text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-md">
            ForgeAI plugs directly into your workflow – IDE, web, terminal, Slack, or Linear.
          </p>

          <p className="font-mono text-gray-600 text-sm md:text-base leading-relaxed mb-10 max-w-md">
            Hand off tasks the moment they appear, no matter where you’re working.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
             <Button variant="primary" onClick={() => navigate('/dashboard')}>Get Started</Button>
             <Button variant="outline">Contact Sales</Button>
          </div>
        </div>

        {/* Right Content - Another Code/UI Block */}
        <div className="flex-1 w-full relative">
            {/* The Floating Orange Dot - purely decorative for the clone */}
            <div className="absolute -left-4 top-1/2 w-2 h-2 rounded-full bg-orange-500 hidden lg:block"></div>

            <div className="bg-white rounded border border-gray-200 shadow-soft overflow-hidden font-mono text-xs">
                {/* Header Tabs */}
                <div className="flex items-center border-b border-gray-200 bg-[#fafafa]">
                    <div className="px-4 py-2 border-r border-gray-200 bg-white text-black font-semibold">Dashboard</div>
                    <div className="px-4 py-2 border-r border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">API</div>
                    <div className="px-4 py-2 border-r border-gray-200 text-gray-500 hover:bg-gray-50 cursor-pointer">Logs</div>
                    <div className="px-4 py-2 text-gray-500 hover:bg-gray-50 cursor-pointer">Monitoring</div>
                    <div className="flex-1 flex justify-end px-2">
                       <div className="flex items-center gap-1 text-[10px] bg-[#333] text-white px-2 py-1 rounded">
                          <span>▶</span> Deploy
                       </div>
                    </div>
                </div>

                {/* Sub Header for file path */}
                <div className="px-4 py-2 border-b border-gray-100 text-[10px] text-gray-400 bg-white flex gap-4">
                    <span>factory-setup.js</span>
                    <span>server/index.js</span>
                    <span>factory.config.js</span>
                </div>

                {/* Code Content */}
                <div className="p-6 bg-white overflow-x-auto">
                    <div className="flex text-[11px] leading-5">
                        <div className="text-gray-300 pr-4 text-right select-none border-r border-gray-100 mr-4">
                            {Array.from({length: 28}).map((_, i) => <div key={i}>{i+1}</div>)}
                        </div>
                        <div className="font-mono text-gray-800">
                            <div className="text-gray-400">// factory-setup.js</div>
                            <div className="text-gray-400">// Backend initialization script for Factory CLI</div>
                            <div><span className="text-purple-600">const</span> express = require(<span className="text-green-600">'express'</span>);</div>
                            <div><span className="text-purple-600">const</span> {'{'} FactorySDK {'}'} = require(<span className="text-green-600">'@factory/server-sdk'</span>);</div>
                            <div><span className="text-purple-600">const</span> cors = require(<span className="text-green-600">'cors'</span>);</div>
                            <div className="text-gray-400">// Initialize Factory SDK</div>
                            <div><span className="text-purple-600">const</span> factory = <span className="text-purple-600">new</span> FactorySDK({'{{'}</div>
                            <div className="pl-4">apiKey: process.env.FACTORY_API_KEY,</div>
                            <div className="pl-4">environment: <span className="text-green-600">'production'</span>,</div>
                            <div className="pl-4">region: <span className="text-green-600">'us-east-1'</span></div>
                            <div>{'}}'});</div>
                            <div className="text-gray-400">// Create Express server</div>
                            <div><span className="text-purple-600">const</span> app = express();</div>
                            <div><span className="text-purple-600">const</span> PORT = process.env.PORT || <span className="text-blue-600">3000</span>;</div>
                            <div className="text-gray-400">// Middleware</div>
                            <div>app.use(cors());</div>
                            <div>app.use(express.json());</div>
                            <div className="text-gray-400">// Health check endpoint</div>
                            <div>app.get(<span className="text-green-600">'/health'</span>, (req, res) ={'>'} {'{'}</div>
                            <div className="pl-4">res.status(<span className="text-blue-600">200</span>).json({'{{'}</div>
                            <div className="pl-8">status: <span className="text-green-600">'healthy'</span>,</div>
                            <div className="pl-8">timestamp: <span className="text-purple-600">new</span> Date().toISOString(),</div>
                            <div className="pl-8">service: <span className="text-green-600">'factory-api'</span></div>
                            <div className="pl-4">{'}}'});</div>
                            <div>{'}'});</div>
                            <div className="text-gray-400">// Factory webhook handler</div>
                            <div>app.post(<span className="text-green-600">'/api/factory/webhook'</span>, <span className="text-purple-600">async</span> (req, res) ={'>'} {'{'}</div>
                            <div className="pl-4">try {'{'}</div>
                            <div className="pl-8"><span className="text-purple-600">const</span> payload = req.body;</div>
                        </div>
                    </div>
                </div>

                {/* Bottom Terminal Mockup embedded in the card */}
                 <div className="border-t border-gray-200 p-4 bg-[#f9f9f9]">
                    <div className="bg-white border border-gray-300 rounded p-2 text-[10px]">
                        <div className="flex gap-2 mb-2">
                            <span className="bg-gray-200 px-1 rounded border border-gray-300">MACOS / LINUX</span>
                            <span className="text-gray-400 border border-transparent">WINDOWS</span>
                        </div>
                        <div className="border border-gray-200 rounded p-2 flex justify-between items-center bg-white">
                             <div className="flex gap-2">
                                <span className="text-orange-500 font-bold">{'>'}</span>
                                <span>curl -fsSL https://forge.ai/install | sh</span>
                             </div>
                             <span className="text-gray-400 cursor-pointer hover:text-black">□</span>
                        </div>
                    </div>
                 </div>

            </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
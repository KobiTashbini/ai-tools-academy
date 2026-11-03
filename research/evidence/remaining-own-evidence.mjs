import {writeFileSync} from 'node:fs';
const checkedAt=new Date().toISOString();
const c=(claim,observedValue,url,title,version='current documentation',confidence='high')=>({claim,observedValue,url,title,checkedAt,version,confidence,limitations:'Official artifact supports the narrow scope, not benchmark/adoption. Timestamp is evidence recording time after opening during this run; exact per-page retrieval time not instrumented.'});
const eco=[
c('Existing LLM foundations','Tokens/context/inference and prompt-vs-parameters consistent; revision3 already distinguishes family/checkpoint/provider/endpoint.','https://developers.google.com/machine-learning/crash-course/llm','Google LLM introduction'),
c('Production system scope','Model is one component among data, testing, serving, monitoring and process management.','https://developers.google.com/machine-learning/crash-course/production-ml-systems','Google Production ML'),
c('Tuning versus prompting','Fine-tuning changes parameters; prompt instructions/examples condition output without changing parameters.','https://developers.google.com/machine-learning/crash-course/llm/tuning','Google Tuning'),
c('ML/LLM ecosystem learning','HF course distinguishes pretrained model use, datasets, tokenizers and fine-tuning libraries.','https://huggingface.co/learn/llm-course/chapter1/1','Hugging Face LLM Course'),
c('Model provenance and licensing','Model cards document model-specific intended use, training/evaluation and license metadata; SDK license is not model license.','https://huggingface.co/docs/hub/model-cards','Hugging Face Model Cards'),
c('Discovery breadth','ML course contains classic regression/classification and embeddings as well as LLM material.','https://developers.google.com/machine-learning/crash-course','Google ML Crash Course')];
const training=[...eco.filter(c=>c.claim!=='Existing LLM foundations'),
c('PyTorch installation channels','Stable and Preview/nightly distinct; choose OS/compute platform. LibTorch C++ separate from .NET binding.','https://pytorch.org/get-started/locally/','PyTorch Start Locally'),
c('PyTorch version uncertainty','Versions page displayed2.9.0 stable, but live release API403 prevents claiming this is latest; no latest version proposed.','https://docs.pytorch.org/docs/versions','PyTorch Documentation Versions','observed documentation channel','medium'),
c('PyTorch license','Root LICENSE includes copyright notices and redistribution terms; API NOASSERTION not no-license.','https://raw.githubusercontent.com/pytorch/pytorch/main/LICENSE','PyTorch LICENSE'),
c('Transformers role','Model definitions and inference/training helpers; Trainer covers PyTorch workflow.','https://huggingface.co/docs/transformers/index','Transformers overview'),
c('Transformers fine-tuning','Task-specific further training of pretrained model; Python Trainer example.','https://huggingface.co/docs/transformers/training','Transformers Training'),
c('Transformers license','Apache2 code, not license for all checkpoints.','https://raw.githubusercontent.com/huggingface/transformers/main/LICENSE','Transformers LICENSE'),
c('Datasets role','Python data loading/processing/streaming with multiple data backends, distinct from dataset content.','https://huggingface.co/docs/datasets/index','Datasets overview'),
c('Datasets license','Apache2 library license does not license all datasets.','https://raw.githubusercontent.com/huggingface/datasets/main/LICENSE','Datasets LICENSE'),
c('PEFT role','Parameter-efficient adaptation using methods such as LoRA; reduced parameter training not benchmark guarantee.','https://huggingface.co/docs/peft/index','PEFT overview'),
c('LoRA versioned reference','Developer guide redirected to versioned0.21.0 LoRA API; this is observed reference version, not proof latest.','https://huggingface.co/docs/peft/v0.21.0/package_reference/lora','PEFT LoRA','0.21.0 reference'),
c('PEFT license','Apache2 code; base-weight and dataset terms remain separate.','https://raw.githubusercontent.com/huggingface/peft/main/LICENSE','PEFT LICENSE'),
c('TRL role','Post-training library includes SFT, preference optimization and RL trainers.','https://huggingface.co/docs/trl/index','TRL overview'),
c('TRL SFT workflow','Python SFT Trainer with explicit dataset formats and training configuration.','https://huggingface.co/docs/trl/sft_trainer','TRL SFT Trainer'),
c('TRL license','Apache2 code, not license for model weights or training data.','https://raw.githubusercontent.com/huggingface/trl/main/LICENSE','TRL LICENSE'),
c('TRL telemetry','Trainer usage statistics may be sent; documented opt-out/offline settings must be reviewed, local training not no-egress.','https://huggingface.co/docs/trl/usage_stats','TRL Usage Stats'),
c('MLflow tracking','Runs log parameters/code/metrics/artifacts; Python/REST/R/Java documented.','https://mlflow.org/docs/latest/ml/tracking/','MLflow Tracking'),
c('MLflow registry','Versions/aliases/tags and promotion workflow; own registry server requires DB backend.','https://mlflow.org/docs/latest/ml/model-registry/workflow/','MLflow Registry'),
c('MLflow .NET scope','Official API index lists Python/TypeScript/R/Java/REST; no official C# client established.','https://mlflow.org/docs/latest/api_reference/','MLflow API index'),
c('MLflow license','Apache2 root LICENSE.txt, not guessed LICENSE URL.','https://github.com/mlflow/mlflow/blob/master/LICENSE.txt','MLflow LICENSE.txt'),
c('W&B Models identity','Repository documents model-experiment tracking and SDK MIT; does not establish whole SaaS license/hosting conditions.','https://github.com/wandb/wandb','W&B repository','current repository','high'),
c('W&B SDK license','MIT for this SDK repository, not all hosted service or Weave.','https://github.com/wandb/wandb/blob/main/LICENSE','W&B SDK LICENSE'),
c('TorchSharp scope/maturity','Dotnet Foundation LibTorch wrapper; README warns breaking changes toward1.0 and IntelMac restrictions; not Python ecosystem parity.','https://github.com/dotnet/TorchSharp','TorchSharp README','README observed; package latest unverified'),
c('TorchSharp license','MIT wrapper code; native LibTorch dependencies separately selected.','https://raw.githubusercontent.com/dotnet/TorchSharp/main/LICENSE.txt','TorchSharp MIT'),
c('ML.NET scope','Native .NET ML framework for training/consuming classical tasks; not general HF LLM fine-tuning API. Core targets netstandard2; optional packages vary.','https://github.com/dotnet/machinelearning','ML.NET README'),
c('ML.NET license','MIT code with third-party notices separate.','https://github.com/dotnet/machinelearning/blob/main/LICENSE','ML.NET LICENSE'),
c('Accelerate discovery','Distributed training and inference helper; deferred as separate record, mention integration.','https://huggingface.co/docs/accelerate/index','Accelerate overview'),
c('DVC discovery','Data/model versioning and pipeline tools; deferred until concrete need beyond initial tracker.','https://dvc.org/doc','DVC docs'),
c('Ray discovery','Distributed training role established; full product audit not completed.','https://docs.ray.io/en/latest/train/train.html','Ray Train','2.59.0 docs')];
for(const [id,claims,accessFailures] of [['ecosystem00',eco,[]],['training11',training,['GitHub REST403 prevented default-branch head and latest releases;9 counters measured before limit.','docs.wandb.ai/models/track redirected to docs.coreweave.com/models/track and failed; alternate CoreWeave product path failed.','Microsoft Learn what-is-mldotnet page unavailable; official repository/README/LICENSE used.','Guessed MLflow LICENSE path404; actual LICENSE.txt opened via repository link.']]])writeFileSync('research/evidence/'+id+'-20261103-v1-sources.json',JSON.stringify({reportId:id+'-20261103-v1',status:'pending_review',approval:null,recordedAt:checkedAt,baselineAt:'2026-11-03T10:51:17.466Z',checkedExisting:1,totalExisting:1,claims,accessFailures},null,2)+'\n');
console.log(JSON.stringify({ecosystemClaims:eco.length,trainingClaims:training.length}));

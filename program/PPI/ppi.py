from __future__ import division
import networkx as nx
import json,csv
from numpy.linalg import norm
# from matplotlib import pyplot as plt
# import matplotlib as mpl
import sys,getopt


#e.g. python 202006_work8_extract_and_draw_seed_based_subnetwork_with_rwr.py --times=100 --seeds=TP53,BRCA1,PTEN --cutoff=0 --species=human
#argv params
#--times=100
#--seeds=gene1,gene2,gene3
#--cutoff=0.1
#--species=0.7
#--output_dir=./
opts, args = getopt.getopt(sys.argv[1:], "", ["times=", "seeds=","cutoff=","species=", "output_dir="])

for o,a in opts:
	if o=="--times":
		times=int(a)
	if o=="--seeds":
		seeds=[x.upper() for x in a.split(',')]
	if o=="--cutoff":
		cutoff=float(a)
	if o=="--species":
		species=a
	if o=="--output_dir":
		output_dir=a	
                

network=nx.Graph()
raw_seeds=seeds[:]

with open('mentha_'+species+'_ppi_network.json') as infile:
	data=json.load(infile)
	seeds=[x for x in seeds if x and data.has_key(x.upper())]
	for n1 in data:
		for n2 in data[n1]:
			w=data[n1][n2]
			if w>cutoff:
				n1=n1.upper()
				n2=n2.upper()
				network.add_edge(n1,n2,weight=w)

print species,'edges',len(network.edges())
print  species,'nodes',len(network.nodes())

with open(output_dir+'check.txt','w') as outfile:
	if len(set(network.nodes())&set(raw_seeds))==0:
		outfile.write("none\n")
		outfile.write(','.join(raw_seeds)+"\n")
		sys.exit(0)
	elif  len(set(network.nodes())&set(raw_seeds))<len(raw_seeds):
		outfile.write("partial\n")
		outfile.write(','.join([x for x in raw_seeds if not x in network.nodes()])+"\n")
	else:
		outfile.write("all\n")
		outfile.write("\n")

node_list=sorted(network.nodes())
A={}
for n1,n2 in network.edges():
	A.setdefault(n1,{}).setdefault(n2,network[n1][n2]['weight'])
	A.setdefault(n2,{}).setdefault(n1,network[n1][n2]['weight'])

W={}
for n1,n2 in network.edges():
	W.setdefault(n1,{}).setdefault(n2,A[n1][n2]/sum(A[n1].values()))
	W.setdefault(n2,{}).setdefault(n1,A[n2][n1]/sum(A[n2].values()))

condition=1e-12
restart=0.7
print 'Iteration starting...'
p_initial={n:0 for n in node_list}
for n in p_initial:
	p_initial[n]=1/len(seeds) if n in seeds else 0
p0=p_initial.copy()
p1={n:0 for n in node_list}
for n1 in W:
	for n2 in W[n1]:
		p1[n2]+=W[n1][n2]*p0[n1]
for n in p1:
	p1[n]=(1-restart)*p1[n]+restart*p_initial[n]
difference=abs(norm(p1.values())-norm(p0.values()))
step=1
print step,difference,restart,sum(p1.values())
while difference>=condition and step<=times:
	p0=p1.copy()
	p1={n:0 for n in node_list}
	for n1 in W:
		for n2 in W[n1]:
			p1[n2]+=W[n1][n2]*p0[n1]
	for n in p1:
		p1[n]=(1-restart)*p1[n]+restart*p_initial[n]
	difference=abs(norm(p1.values())-norm(p0.values()))
	step+=1
	print step,difference,restart,sum(p1.values())
print 'Iteration terminated...'
# for i,x in enumerate(sorted(p1.iteritems(),key=lambda x:x[1],reverse=True)[:100]):
	# print 'rank:',i+1,'gene:',x[0],'prob:','%e' % x[1]

gene_list=[x[0] for x in sorted(p1.iteritems(),key=lambda x:x[1],reverse=True)]
coef_list=[]
# for top in xrange(1,len(gene_list)+1):
for top in xrange(1,100+1):
	genes=gene_list[:top]
	subnetwork=network.subgraph(genes)
	#coef=nx.algorithms.cluster.transitivity(subnetwork)
	coef=nx.algorithms.cluster.average_clustering(subnetwork)
	coef_list.append(coef)
	print top,coef
	# if coef<max(coef_list):
		# genes=gene_list[:top]
		# for x in genes:
			# print x
		# fig = plt.figure(figsize=(12,12))
		# pos = nx.spring_layout(subnetwork)
		# nx.draw(subnetwork, pos, node_size=1600, node_color='yellow', font_size=16, font_weight='bold',with_labels=True)
		# plt.tight_layout()
		# plt.savefig('work10_subnetwork.png')
		# plt.show()
		# break
top=coef_list.index(max(coef_list[5:]))+1
genes=gene_list[:top]
for x in genes:
	print x
subnetwork=network.subgraph(genes)
with open(output_dir+'seed_based_subnetwork_nodes.csv','w') as outfile:
	writer=csv.writer(outfile)
	writer.writerow(['node','attribute'])
	for x in genes:
		writer.writerow([x,'node'])
with open(output_dir+'seed_based_subnetwork_edges.csv','w') as outfile:
	writer=csv.writer(outfile)
	writer.writerow(['source','interaction','target'])
	for edge in subnetwork.edges():
		writer.writerow([edge[0],'interaction',edge[1]])
# fig = plt.figure(figsize=(40,20))
# pos = nx.kamada_kawai_layout(subnetwork)
# 
# node_colors=[]
# nodes=subnetwork.nodes()
# for node in nodes:
# 	if node in seeds:
# 		node_colors.append('mediumpurple')
# 	else:
# 		node_colors.append('lightgrey')
# nx.draw(subnetwork, pos, node_size=2000, node_color=node_colors, width=2,edge_color='cornflowerblue',font_size=32, font_weight='bold',font_color='black',with_labels=True)
# plt.savefig('subnetwork.svg')
# plt.close(fig)

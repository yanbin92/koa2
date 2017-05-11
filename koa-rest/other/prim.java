import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeSet;
/**

 */
public class PrimDemo {
	/**
		Prim算法过程：
		
		一条边一条边地加， 维护一棵树。
		
		初始 E ＝ ｛｝空集合， V = ｛任意节点｝
		
		循环（n – 1）次，每次选择一条边（v1,v2）， 
		满足：v1属于V , v2不属于V。且（v1,v2）权值最小。
		
		E = E + （v1,v2）
		V = V + v2
		最终E中的边是一棵最小生成树， V包含了全部节点。
		
		输入
		第1行：2个数N,M中间用空格分隔，N为点的数量，M为边的数量。（2 <= N <= 1000, 1 <= M <= 50000)
		第2 - M + 1行：每行3个数S E W，分别表示M条边的2个顶点及权值。(1 <= S, E <= N，1 <= W <= 10000)
		
		输出
		输出最小生成树的所有边的权值之和。
		输入示例
			
			9 14
			1 2 4
			2 3 8
			3 4 7
			4 5 9
			5 6 10
			6 7 2
			7 8 1
			8 9 7
			2 8 11
			3 9 2
			7 9 6
			3 6 4
			4 6 14
			1 8 8
			
			输出示例
			
			37
	 * @param args
	 */
	public static void main(String[] args) {
		Scanner in = new Scanner(System.in);
		int N = in.nextInt();//N为点的数量
		int M = in.nextInt();//M为边的数量
		//第2 ---M + 1行
		//记录边的信息
		Set<TreeItem> tree=new TreeSet<TreeItem>(new Comparator<TreeItem>(){
			@Override
			public int compare(TreeItem o1, TreeItem o2) {
				return o1.W<o2.W?-1:1;
			}
			
		});

		for(int i=0;i<M;i++){
			TreeItem item=new TreeItem();
			item.S=in.nextInt();
			item.E=in.nextInt();
			item.W=in.nextInt();
			tree.add(item);
			//System.out.println(s+" "+e+" "+W);
		}
//		for(TreeItem item:tree){
//			System.out.println(item.toString());
//		}
		/**
		 一条边一条边地加， 维护一棵树。
		
		初始 E ＝ ｛｝空集合， V = ｛任意节点｝
		
		循环（n – 1）次，每次选择一条边（v1,v2）， 
		满足：v1属于V , v2不属于V。且（v1,v2）权值最小。
		
		E = E + （v1,v2）
		V = V + v2
		最终E中的边是一棵最小生成树， V包含了全部节点
		 */
		Set<Integer> V=new HashSet<Integer>();	
		V.add(1);//
		Set<TreeItem> selectItems=new HashSet<TreeItem>();	
	
	
		for(int i=1;i<N;i++){
			int min_W =0;
			TreeItem selectItem=new TreeItem();
			//v1属于V , v2不属于V
			// 一条边一条边地加， 维护一棵树。
			Iterator<TreeItem> iterator = tree.iterator();

			while(iterator.hasNext()){
				TreeItem item=iterator.next();
				////每次选择一条边（v1,v2）， 
				//满足：v1属于V , v2不属于V。且（v1,v2）权值最小。
				if((V.contains(item.S)&&!V.contains(item.E))||(V.contains(item.E)&&!V.contains(item.S))
						){//v1属于V  v2不属于V
					if(min_W==0||item.W<min_W){
						min_W=item.W;
						selectItem=item;
					}
				}
			}
			//选过的边不用再过滤了
			//tree.remove(selectItem);
			//System.out.println(selectItem.toString());
			V.add(selectItem.E);
			V.add(selectItem.S);
			selectItems.add(selectItem);
		}
	
		double sum=0;
		for(TreeItem item :selectItems){
			sum+=item.W;
		}
		System.out.println(sum);
	}	
}

class TreeItem{
	int S;
	int E;//顶点  W//权值
	public int W;
	
	public String toString(){
		return S+" "+E+" "+W;
		
	}
}
